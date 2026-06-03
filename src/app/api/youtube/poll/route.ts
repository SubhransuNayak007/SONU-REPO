import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, logActivity, Comment as DBComment } from "@/lib/db";
import { fetchVideoComments, postCommentReply } from "@/lib/youtube";

function matchesCondition(text: string, type: string, value: string): boolean {
  const t = text.toLowerCase();
  const v = value.toLowerCase();
  if (type === "contains") return t.includes(v);
  if (type === "equals") return t === v;
  if (type === "starts_with") return t.startsWith(v);
  if (type === "regex") {
    try {
      const rx = new RegExp(value, "i");
      return rx.test(text);
    } catch {
      return false;
    }
  }
  return false;
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDB();
    const channels = db.channels;
    
    if (!channels || channels.length === 0) {
      return NextResponse.json({ message: "No connected channels found. Link a channel first." });
    }

    const activeUser = db.userSession || {
      email: "",
      name: "Creator",
      tier: "free" as const,
      repliesToday: 0,
      lastResetDate: new Date().toISOString().split("T")[0]
    };

    // Calculate limit by tier: Free = 0 replies/day, Premium = 200 replies/day
    const maxDailyLimit = activeUser.tier === "premium" ? 200 : 0;
    
    // Ensure date resets if necessary
    const todayStr = new Date().toISOString().split("T")[0];
    if (activeUser.lastResetDate !== todayStr) {
      activeUser.repliesToday = 0;
      activeUser.lastResetDate = todayStr;
    }

    let checkedCount = 0;
    let matchedCount = 0;
    let repliedCount = 0;
    let skippedCount = 0;
    let limitReached = false;

    // Iterate through all connected channels
    for (const channel of channels) {
      const automatedVideos = channel.automatedVideos || [];
      if (automatedVideos.length === 0) continue;

      for (const videoId of automatedVideos) {
        // Fetch latest comment threads from YouTube API
        const ytComments = await fetchVideoComments(channel.id, videoId);
        
        for (const item of ytComments) {
          const topComment = item.snippet?.topLevelComment;
          if (!topComment) continue;

          const commentId = topComment.id;
          const author = topComment.snippet?.authorDisplayName || "Viewer";
          const authorAvatar = topComment.snippet?.authorChannelImageUrl || "";
          const text = topComment.snippet?.textDisplay || topComment.snippet?.textOriginal || "";
          const publishedAt = topComment.snippet?.publishedAt || new Date().toISOString();
          const videoTitle = "Automated Video Stream"; // default placeholder since thread API doesn't return video title
          const videoThumbnail = "";

          checkedCount++;

          // 1. Check if comment is already processed in local DB
          const alreadyProcessed = db.comments.some((c) => c.id === commentId);
          if (alreadyProcessed) {
            skippedCount++;
            continue;
          }

          // 2. Evaluate against active rules sorted by priority
          const sortedRules = [...db.rules].sort((a, b) => a.priority - b.priority);
          let matchedRule = null;

          for (const rule of sortedRules) {
            if (!rule.isActive) continue;

            const isMatch = rule.operator === "OR" 
              ? rule.conditions.some((c) => matchesCondition(text, c.type, c.value))
              : rule.conditions.every((c) => matchesCondition(text, c.type, c.value));

            if (isMatch) {
              matchedRule = rule;
              break;
            }
          }

          if (matchedRule) {
            matchedCount++;

            // Check if user limit is reached
            if (activeUser.repliesToday >= maxDailyLimit) {
              limitReached = true;
              // Log comment as skipped due to limit
              const skippedComment: DBComment = {
                id: commentId,
                channelId: channel.id,
                author,
                authorAvatar,
                authorSubscribers: "0",
                authorHistoryCount: 0,
                text,
                videoTitle,
                videoThumbnail,
                publishedAt,
                status: "failed", // Flag as failed (quota limit)
                matchedRuleId: matchedRule.id,
                delayRemainingSeconds: 0,
                autoReplyText: "Daily reply quota limit reached for this user tier.",
                replyFiredAt: null
              };
              db.comments.unshift(skippedComment);
              continue;
            }

            // 3. Find Template and interpolate variables
            const template = db.templates.find((t) => t.id === matchedRule?.templateId);
            if (!template) {
              console.error(`Template ${matchedRule.templateId} not found for rule ${matchedRule.name}`);
              continue;
            }

            // Generate reply body
            let replyText = template.body
              .replace(/\{\{commenter_name\}\}/g, author)
              .replace(/\{\{custom_variable_1\}\}/g, matchedRule.customVariable1 || "")
              .replace(/\{\{custom_variable_2\}\}/g, matchedRule.customVariable2 || "")
              .replace(/\{\{custom_variable_3\}\}/g, matchedRule.customVariable3 || "");

            // 4. Post Reply to YouTube API
            const ytResponse = await postCommentReply(channel.id, commentId, replyText);

            if (ytResponse) {
              // Successfully replied! Increment today counter
              activeUser.repliesToday++;
              repliedCount++;
              
              // Increment usage counter on template
              const tplIdx = db.templates.findIndex((t) => t.id === template.id);
              if (tplIdx >= 0) db.templates[tplIdx].usageCount++;

              // Save success entry in local DB
              const successComment: DBComment = {
                id: commentId,
                channelId: channel.id,
                author,
                authorAvatar,
                authorSubscribers: "0",
                authorHistoryCount: 1,
                text,
                videoTitle,
                videoThumbnail,
                publishedAt,
                status: "replied",
                matchedRuleId: matchedRule.id,
                delayRemainingSeconds: 0,
                autoReplyText: replyText,
                replyFiredAt: new Date().toISOString()
              };
              db.comments.unshift(successComment);
              await logActivity("System", `Auto-replied to ${author} on video. Rule: '${matchedRule.name}'`);
            } else {
              // Mark comment check as failed
              const failedComment: DBComment = {
                id: commentId,
                channelId: channel.id,
                author,
                authorAvatar,
                authorSubscribers: "0",
                authorHistoryCount: 0,
                text,
                videoTitle,
                videoThumbnail,
                publishedAt,
                status: "failed",
                matchedRuleId: matchedRule.id,
                delayRemainingSeconds: 0,
                autoReplyText: "Failed to post comment to YouTube API. Check credentials or network connectivity.",
                replyFiredAt: null
              };
              db.comments.unshift(failedComment);
            }
          } else {
            // Log comment as skipped (no rule matches)
            const skippedComment: DBComment = {
              id: commentId,
              channelId: channel.id,
              author,
              authorAvatar,
              authorSubscribers: "0",
              authorHistoryCount: 0,
              text,
              videoTitle,
              videoThumbnail,
              publishedAt,
              status: "skipped",
              matchedRuleId: null,
              delayRemainingSeconds: 0,
              autoReplyText: null,
              replyFiredAt: null
            };
            db.comments.unshift(skippedComment);
          }
        }
      }
    }

    // Keep processed comments in database list at a max of 200 to keep it lightweight
    if (db.comments.length > 200) {
      db.comments = db.comments.slice(0, 200);
    }

    db.userSession = activeUser;
    await saveDB(db);

    return NextResponse.json({
      success: true,
      summary: {
        checkedCount,
        matchedCount,
        repliedCount,
        skippedCount,
        limitReached,
        repliesToday: activeUser.repliesToday,
        maxDailyLimit
      }
    });
  } catch (err: any) {
    console.error("Poller endpoint exception:", err);
    return NextResponse.json({ error: "Failed to poll comments: " + err.message }, { status: 500 });
  }
}
