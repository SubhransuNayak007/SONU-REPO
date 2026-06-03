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

export interface Coupon {
  code: string;
  isUsed: boolean;
  usedBy?: string;
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
  coupons?: Coupon[];
}

const DEFAULT_TEMPLATES: Template[] = [];
const DEFAULT_RULES: Rule[] = [];

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
            email: "",
            name: "Creator",
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

        if (!parsed.coupons) {
          parsed.coupons = [];
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
          workspace: { name: "My Workspace", members: [], settings: { dailyReplyQuota: 500, blockedUsers: [], spamProtection: true, slackWebhook: "", emailDigest: "weekly" } },
          channels: [],
          templates: [],
          rules: [],
          comments: [],
          activityLogs: [],
          userSession: {
            email: "",
            name: "Creator",
            tier: "free",
            repliesToday: 0,
            lastResetDate: new Date().toISOString().split("T")[0]
          },
          authSettings: {
            googleClientId: "",
            googleClientSecret: ""
          },
          coupons: []
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
        workspace: { name: "My Workspace", members: [], settings: { dailyReplyQuota: 500, blockedUsers: [], spamProtection: true, slackWebhook: "", emailDigest: "weekly" } },
        channels: [],
        templates: [],
        rules: [],
        comments: [],
        activityLogs: [],
        userSession: {
          email: "",
          name: "Creator",
          tier: "free",
          repliesToday: 0,
          lastResetDate: new Date().toISOString().split("T")[0]
        },
        authSettings: {
          googleClientId: "",
          googleClientSecret: ""
        },
        coupons: []
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
        email: "",
        name: "Creator",
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
    if (!parsed.coupons) {
      parsed.coupons = [];
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
      templates: [],
      rules: [],
      comments: [],
      activityLogs: [],
      userSession: {
        email: "",
        name: "Creator",
        tier: "free",
        repliesToday: 0,
        lastResetDate: new Date().toISOString().split("T")[0]
      },
      authSettings: {
        googleClientId: "",
        googleClientSecret: ""
      },
      coupons: []
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
    user: user || "Creator",
    action,
    timestamp: new Date().toISOString()
  };
  db.activityLogs.unshift(newLog);
  if (db.activityLogs.length > 100) {
    db.activityLogs = db.activityLogs.slice(0, 100);
  }
  await saveDB(db);
}
