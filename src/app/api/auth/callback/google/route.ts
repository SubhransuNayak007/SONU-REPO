import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, logActivity } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const state = searchParams.get("state") || "dashboard";

  if (error) {
    console.error("OAuth error from Google:", error);
    const dest = state === "onboarding" ? "onboarding" : "dashboard/channels";
    return NextResponse.redirect(`${new URL(req.url).origin}/${dest}?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    const dest = state === "onboarding" ? "onboarding" : "dashboard/channels";
    return NextResponse.redirect(`${new URL(req.url).origin}/${dest}?error=missing_code`);
  }

  try {
    const db = await getDB();
    const clientId = db.authSettings?.googleClientId || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = db.authSettings?.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET;
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const redirectUri = `${origin}/api/auth/callback/google`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${new URL(req.url).origin}/dashboard/channels?error=credentials_not_configured`);
    }

    // 1. Exchange Auth Code for Access & Refresh Tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("Token exchange failed:", errBody);
      return NextResponse.redirect(`${new URL(req.url).origin}/dashboard/channels?error=token_exchange_failed`);
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token } = tokenData;

    // 2. Fetch Channel Metadata from YouTube API
    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    if (!channelRes.ok) {
      const errBody = await channelRes.text();
      console.error("YouTube Channel metadata fetch failed:", errBody);
      return NextResponse.redirect(`${new URL(req.url).origin}/dashboard/channels?error=youtube_metadata_failed`);
    }

    const channelData = await channelRes.json();
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.redirect(`${new URL(req.url).origin}/dashboard/channels?error=no_youtube_channel_found`);
    }

    const ytChannel = channelData.items[0];
    const channelId = ytChannel.id;
    const name = ytChannel.snippet.title;
    const handle = ytChannel.snippet.customUrl || `@channel_${channelId}`;
    const avatar = ytChannel.snippet.thumbnails?.default?.url || "";
    const subsCount = ytChannel.statistics?.subscriberCount;
    
    // Format subscriber count (e.g. 1.2M or 45K)
    let subscribers = "0";
    if (subsCount) {
      const num = parseInt(subsCount, 10);
      if (num >= 1000000) {
        subscribers = (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        subscribers = Math.round(num / 1000) + "K";
      } else {
        subscribers = num.toString();
      }
    }

    // 3. Save or Update Channel in Database
    const existingIndex = db.channels.findIndex((c) => c.id === channelId);
    const updatedChannel = {
      id: channelId,
      name,
      handle,
      avatar,
      status: "active" as const,
      subscribers,
      accessToken: access_token,
      // Retain existing refresh token if Google didn't return a new one on re-auth
      refreshToken: refresh_token || (existingIndex >= 0 ? db.channels[existingIndex].refreshToken : undefined),
      automatedVideos: existingIndex >= 0 ? (db.channels[existingIndex].automatedVideos || []) : []
    };

    if (existingIndex >= 0) {
      db.channels[existingIndex] = updatedChannel;
    } else {
      db.channels.push(updatedChannel);
    }

    await logActivity(
      db.userSession?.name || "System", 
      `Linked YouTube channel: ${name} (${handle})`
    );

    await saveDB(db);

    // Redirect dynamically based on source state
    if (state === "onboarding") {
      return NextResponse.redirect(`${new URL(req.url).origin}/onboarding?success=connected&channel=${encodeURIComponent(name)}`);
    }
    return NextResponse.redirect(`${new URL(req.url).origin}/dashboard/channels?success=connected&channel=${encodeURIComponent(name)}`);
  } catch (err) {
    console.error("OAuth callback exception:", err);
    const dest = state === "onboarding" ? "onboarding" : "dashboard/channels";
    return NextResponse.redirect(`${new URL(req.url).origin}/${dest}?error=callback_exception`);
  }
}
