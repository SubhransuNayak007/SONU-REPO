import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = await getDB();
  const { searchParams } = new URL(req.url);
  const isLogin = searchParams.get("login") === "true";
  const stateVal = searchParams.get("state") || "dashboard";
  
  const finalState = isLogin ? `login:${stateVal}` : stateVal;
  
  // Read Client ID from database config, falling back to env variables
  const clientId = db.authSettings?.googleClientId || process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json({ 
      error: "Google Client ID is not configured. Please add your credentials in Settings." 
    }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/callback/google`;
  
  const scopes = isLogin
    ? ["openid", "email", "profile"]
    : ["openid", "email", "profile", "https://www.googleapis.com/auth/youtube.force-ssl", "https://www.googleapis.com/auth/youtube.readonly"];

  // Construct OAuth URL
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scopes.join(" "))}&` +
    `access_type=offline&` +
    `state=${encodeURIComponent(finalState)}&` +
    `prompt=consent`;

  return NextResponse.redirect(authUrl);
}
