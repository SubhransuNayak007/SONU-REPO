import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

const FREE_DAILY_LIMIT = 10;

export async function GET() {
  try {
    const db = await getDB();
    const session = db.userSession;

    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const tier = session.tier || "free";
    const isUnlimited = tier === "premium";
    const used = session.repliesToday || 0;
    const limit = isUnlimited ? Infinity : FREE_DAILY_LIMIT;

    return NextResponse.json({
      used,
      limit: isUnlimited ? null : FREE_DAILY_LIMIT,
      tier,
      isUnlimited,
      remaining: isUnlimited ? null : Math.max(0, FREE_DAILY_LIMIT - used),
      lastResetDate: session.lastResetDate,
    });
  } catch (err) {
    console.error("Usage API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
