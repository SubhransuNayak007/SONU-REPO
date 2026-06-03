import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, logActivity } from "@/lib/db";

// Handle coupon management (Admin GET, Admin/User POST)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminPass = searchParams.get("adminPass");

  if (adminPass !== "4redfglpo098.;") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDB();
  return NextResponse.json(db.coupons || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDB();

    if (!db.coupons) {
      db.coupons = [];
    }

    // 1. Coupon Generation (Admin)
    if (body.adminPass) {
      if (body.adminPass !== "4redfglpo098.;") {
        return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
      }

      const code = body.code ? body.code.toUpperCase().trim() : `FREE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      if (db.coupons.some((c) => c.code === code)) {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
      }

      const newCoupon = {
        code,
        isUsed: false
      };

      db.coupons.push(newCoupon);
      await saveDB(db);

      await logActivity("Admin", `Generated premium coupon code: ${code}`);

      return NextResponse.json(newCoupon, { status: 201 });
    }

    // 2. Coupon Redemption (User)
    const code = body.code ? body.code.toUpperCase().trim() : "";
    if (!code) {
      return NextResponse.json({ error: "Missing coupon code" }, { status: 400 });
    }

    const couponIndex = db.coupons.findIndex((c) => c.code === code);
    if (couponIndex === -1) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    const coupon = db.coupons[couponIndex];
    if (coupon.isUsed) {
      return NextResponse.json({ error: "This coupon code has already been used" }, { status: 400 });
    }

    // Upgrade user tier to premium
    if (db.userSession) {
      db.userSession.tier = "premium";
    } else {
      db.userSession = {
        email: "",
        name: "Creator",
        tier: "premium",
        repliesToday: 0,
        lastResetDate: new Date().toISOString().split("T")[0]
      };
    }
    
    db.coupons[couponIndex].isUsed = true;
    db.coupons[couponIndex].usedBy = db.userSession?.email || "unknown";

    await saveDB(db);

    await logActivity(
      db.userSession?.name || "Creator", 
      `Redeemed premium coupon code: ${code}`
    );

    return NextResponse.json({
      success: true,
      message: "Subscription successfully upgraded to Premium!",
      userSession: db.userSession
    });
  } catch (err) {
    console.error("Coupon error:", err);
    return NextResponse.json({ error: "Failed to process coupon request" }, { status: 500 });
  }
}
