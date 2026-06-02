import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = await getDB();
  
  // Read Client ID from database config, falling back to env variables
  const clientId = db.authSettings?.googleClientId || process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json({ 
      error: "Google Client ID is not configured. Please add your credentials in Settings." 
    }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/callback/google`;
  
  // Construct OAuth URL with YouTube force-ssl and standard profile scopes
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent("https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly")}&` +
    `access_type=offline&` +
    `prompt=consent`;

  return NextResponse.redirect(authUrl);
}
