import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

// Cached connection promises for MongoDB serverless execution
let mongoClient: MongoClient | null = null;
let mongoClientPromise: Promise<MongoClient> | null = null;

async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (mongoClientPromise) {
    return mongoClientPromise;
  }

  mongoClient = new MongoClient(uri);
  mongoClientPromise = mongoClient.connect();
  return mongoClientPromise;
}

export interface WorkspaceMember {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface WorkspaceSettings {
  dailyReplyQuota: number;
  blockedUsers: string[];
  spamProtection: boolean;
  slackWebhook: string;
  emailDigest: string;
}

export interface Workspace {
  name: string;
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  status: "active" | "quota_error";
  subscribers: string;
  refreshToken?: string;
  accessToken?: string;
  automatedVideos?: string[];
}

export interface Template {
  id: string;
  name: string;
  emoji: string;
  body: string;
  variants: string[];
  usageCount: number;
  lastEdited: string;
}

export interface RuleCondition {
  id: string;
  type: "contains" | "equals" | "regex" | "starts_with";
  value: string;
}

export interface RuleFilters {
  topLevelOnly: boolean;
  maxRepliesPerUser: number;
  language: string;
}

export interface Rule {
  id: string;
  name: string;
  isActive: boolean;
  priority: number;
  colorLabel: "red" | "blue" | "yellow" | "green";
  conditions: RuleCondition[];
  operator: "AND" | "OR";
  filters: RuleFilters;
  templateId: string;
  delaySeconds: number;
  dailyLimit: number;
  customVariable1: string;
  customVariable2: string;
  customVariable3: string;
}

export interface Comment {
  id: string;
  channelId: string;
  author: string;
  authorAvatar: string;
  authorSubscribers: string;
  authorHistoryCount: number;
  text: string;
  videoTitle: string;
  videoThumbnail: string;
  publishedAt: string;
  status: "matched" | "review" | "replied" | "skipped" | "failed";
  matchedRuleId: string | null;
  delayRemainingSeconds: number;
  autoReplyText: string | null;
  replyFiredAt: string | null;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface UserSession {
  email: string;
  name: string;
  tier: "free" | "premium";
  repliesToday: number;
  lastResetDate: string;
}

export interface AuthSettings {
  googleClientId: string;
  googleClientSecret: string;
}

export interface DBData {
  workspace: Workspace;
  channels: Channel[];
  templates: Template[];
  rules: Rule[];
  comments: Comment[];
  activityLogs: ActivityLog[];
  userSession?: UserSession;
  authSettings?: AuthSettings;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "tpl-pricing",
    name: "Pricing & Plans Guide",
    emoji: "💵",
    body: "Hey {{commenter_name}}! 👋 Our pricing starts at $29/mo. Check out our detailed pricing plans here → {{custom_variable_1}}! Let me know if you have any questions.",
    variants: [
      "Hey {{commenter_name}}! 👋 Our pricing starts at $29/mo. Check out our detailed pricing plans here → {{custom_variable_1}}! Let me know if you have any questions.",
      "Hi {{commenter_name}}! You can find the cost details on our website here: {{custom_variable_1}} 🚀. Hope this helps!",
      "Thanks for asking, {{commenter_name}}! All plan details are listed at {{custom_variable_1}}."
    ],
    usageCount: 0,
    lastEdited: "2026-06-02T18:00:00Z"
  },
  {
    id: "tpl-discount",
    name: "10% Creator Discount",
    emoji: "🏷️",
    body: "Hey {{commenter_name}}! Thanks for watching. Use code {{custom_variable_2}} for 10% off our course or products! Link: {{custom_variable_1}}",
    variants: [
      "Hey {{commenter_name}}! Thanks for watching. Use code {{custom_variable_2}} for 10% off our course or products! Link: {{custom_variable_1}}",
      "Hi {{commenter_name}}! Grab 10% off with promo code {{custom_variable_2}} at checkout! Link: {{custom_variable_1}} 🎉"
    ],
    usageCount: 0,
    lastEdited: "2026-06-02T18:00:00Z"
  },
  {
    id: "tpl-support",
    name: "Customer Support Escalation",
    emoji: "🔧",
    body: "Hello {{commenter_name}}! Sorry to hear you are having trouble. Please reach out to our team at {{custom_variable_3}} and we will investigate right away.",
    variants: [
      "Hello {{commenter_name}}! Sorry to hear you are having trouble. Please reach out to our team at {{custom_variable_3}} and we will investigate right away.",
      "Hi {{commenter_name}}, please send our team an email at {{custom_variable_3}} with your details so we can fix this for you ASAP!"
    ],
    usageCount: 0,
    lastEdited: "2026-06-02T18:00:00Z"
  }
];

const DEFAULT_RULES: Rule[] = [
  {
    id: "rule-pricing",
    name: "Pricing Inquiries",
    isActive: true,
    priority: 1,
    colorLabel: "red",
    conditions: [
      { id: "cond-1", type: "contains", value: "price" },
      { id: "cond-2", type: "contains", value: "cost" },
      { id: "cond-3", type: "contains", value: "how much" }
    ],
    operator: "OR",
    filters: {
      topLevelOnly: true,
      maxRepliesPerUser: 5,
      language: "auto"
    },
    templateId: "tpl-pricing",
    delaySeconds: 180,
    dailyLimit: 50,
    customVariable1: "https://tubeflow.com/pricing",
    customVariable2: "",
    customVariable3: ""
  },
  {
    id: "rule-discount",
    name: "Discount & Coupons",
    isActive: true,
    priority: 2,
    colorLabel: "blue",
    conditions: [
      { id: "cond-4", type: "contains", value: "discount" },
      { id: "cond-5", type: "contains", value: "coupon" },
      { id: "cond-6", type: "contains", value: "promo" }
    ],
    operator: "OR",
    filters: {
      topLevelOnly: true,
      maxRepliesPerUser: 3,
      language: "en"
    },
    templateId: "tpl-discount",
    delaySeconds: 300,
    dailyLimit: 30,
    customVariable1: "https://tubeflow.com/shop",
    customVariable2: "YOUTUBE10",
    customVariable3: ""
  },
  {
    id: "rule-support",
    name: "Technical Support",
    isActive: true,
    priority: 3,
    colorLabel: "yellow",
    conditions: [
      { id: "cond-7", type: "contains", value: "broken" },
      { id: "cond-8", type: "contains", value: "error" },
      { id: "cond-9", type: "contains", value: "doesn't work" }
    ],
    operator: "OR",
    filters: {
      topLevelOnly: false,
      maxRepliesPerUser: 5,
      language: "auto"
    },
    templateId: "tpl-support",
    delaySeconds: 120,
    dailyLimit: 20,
    customVariable1: "",
    customVariable2: "",
    customVariable3: "support@tubeflow.com"
  }
];

export async function getDB(): Promise<DBData> {
  const uri = process.env.MONGODB_URI;
  
  if (uri) {
    try {
      const client = await getMongoClient();
      const db = client.db("tubeflow");
      const collection = db.collection("state");
      const document = await collection.findOne({ _id: "global_db_state" as any });

      if (document) {
        const { _id, ...rest } = document;
        const parsed = rest as unknown as DBData;
        let dirty = false;

        if (!parsed.userSession) {
          parsed.userSession = {
            email: "sarah.creator@acme.com",
            name: "Sarah Jenkins",
            tier: "free",
            repliesToday: 0,
            lastResetDate: new Date().toISOString().split("T")[0]
          };
          dirty = true;
        }

        if (!parsed.authSettings) {
          parsed.authSettings = {
            googleClientId: "",
            googleClientSecret: ""
          };
          dirty = true;
        }

        const todayStr = new Date().toISOString().split("T")[0];
        if (parsed.userSession.lastResetDate !== todayStr) {
          parsed.userSession.repliesToday = 0;
          parsed.userSession.lastResetDate = todayStr;
          dirty = true;
        }

        if (dirty) {
          await saveDB(parsed);
        }

        return parsed;
      } else {
        // Document not found in Mongo, seed default structure
        const defaultData: DBData = {
          workspace: { name: "My Workspace", members: [{ id: "m1", email: "sarah.creator@acme.com", name: "Sarah Jenkins", role: "Owner", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }], settings: { dailyReplyQuota: 500, blockedUsers: [], spamProtection: true, slackWebhook: "", emailDigest: "weekly" } },
          channels: [],
          templates: DEFAULT_TEMPLATES,
          rules: DEFAULT_RULES,
          comments: [],
          activityLogs: [{ id: "log-creation", user: "Sarah Jenkins", action: "Initialized workspace settings in cloud", timestamp: new Date().toISOString() }],
          userSession: {
            email: "sarah.creator@acme.com",
            name: "Sarah Jenkins",
            tier: "free",
            repliesToday: 0,
            lastResetDate: new Date().toISOString().split("T")[0]
          },
          authSettings: {
            googleClientId: "",
            googleClientSecret: ""
          }
        };
        await saveDB(defaultData);
        return defaultData;
      }
    } catch (err) {
      console.error("Failed to query MongoDB state, falling back to local storage:", err);
    }
  }

  // Local fallback
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultData: DBData = {
        workspace: { name: "My Workspace", members: [{ id: "m1", email: "sarah.creator@acme.com", name: "Sarah Jenkins", role: "Owner", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }], settings: { dailyReplyQuota: 500, blockedUsers: [], spamProtection: true, slackWebhook: "", emailDigest: "weekly" } },
        channels: [],
        templates: DEFAULT_TEMPLATES,
        rules: DEFAULT_RULES,
        comments: [],
        activityLogs: [{ id: "log-creation", user: "Sarah Jenkins", action: "Initialized workspace settings", timestamp: new Date().toISOString() }],
        userSession: {
          email: "sarah.creator@acme.com",
          name: "Sarah Jenkins",
          tier: "free",
          repliesToday: 0,
          lastResetDate: new Date().toISOString().split("T")[0]
        },
        authSettings: {
          googleClientId: "",
          googleClientSecret: ""
        }
      };
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf8");
      return defaultData;
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as DBData;

    let dirty = false;
    if (!parsed.userSession) {
      parsed.userSession = {
        email: "sarah.creator@acme.com",
        name: "Sarah Jenkins",
        tier: "free",
        repliesToday: 0,
        lastResetDate: new Date().toISOString().split("T")[0]
      };
      dirty = true;
    }
    if (!parsed.authSettings) {
      parsed.authSettings = {
        googleClientId: "",
        googleClientSecret: ""
      };
      dirty = true;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (parsed.userSession.lastResetDate !== todayStr) {
      parsed.userSession.repliesToday = 0;
      parsed.userSession.lastResetDate = todayStr;
      dirty = true;
    }

    if (dirty) {
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), "utf8");
    }

    return parsed;
  } catch (err) {
    console.error("Failed to read DB file:", err);
    return {
      workspace: { name: "Error Workspace", members: [], settings: { dailyReplyQuota: 100, blockedUsers: [], spamProtection: true, slackWebhook: "", emailDigest: "weekly" } },
      channels: [],
      templates: DEFAULT_TEMPLATES,
      rules: DEFAULT_RULES,
      comments: [],
      activityLogs: [],
      userSession: {
        email: "sarah.creator@acme.com",
        name: "Sarah Jenkins",
        tier: "free",
        repliesToday: 0,
        lastResetDate: new Date().toISOString().split("T")[0]
      },
      authSettings: {
        googleClientId: "",
        googleClientSecret: ""
      }
    };
  }
}

export async function saveDB(data: DBData): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const client = await getMongoClient();
      const db = client.db("tubeflow");
      const collection = db.collection("state");
      await collection.replaceOne(
        { _id: "global_db_state" as any },
        { ...data, _id: "global_db_state" as any },
        { upsert: true }
      );
      return true;
    } catch (err) {
      console.error("Failed to write to MongoDB:", err);
    }
  }

  // Local fallback
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to write to DB file:", err);
    return false;
  }
}

export async function logActivity(user: string, action: string) {
  const db = await getDB();
  const newLog: ActivityLog = {
    id: `log-${Date.now()}`,
    user,
    action,
    timestamp: new Date().toISOString()
  };
  db.activityLogs.unshift(newLog);
  if (db.activityLogs.length > 100) {
    db.activityLogs = db.activityLogs.slice(0, 100);
  }
  await saveDB(db);
}
