"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas-bg font-sans p-6 sm:p-12 md:p-24 items-center">
      <div className="w-full max-w-3xl bg-white border border-[#dadce0] rounded-2xl shadow-google-card p-8 sm:p-12 text-left">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-google-blue hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="font-display text-2xl font-extrabold text-[#202124] sm:text-3xl mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mb-8 font-semibold">Last Updated: June 3, 2026</p>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">1. Information We Collect</h2>
            <p>
              We only collect information necessary to provide TubeFlow comment automation features. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Your basic Google profile information (email address and name) used for identification and account login.</li>
              <li>Connected YouTube channel metadata (channel name, ID, handle, subscriber count, and avatar URLs).</li>
              <li>YouTube comments on your automated videos, solely to evaluate trigger keywords and execute reply logs.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">2. Google API & YouTube Data Access</h2>
            <p>
              TubeFlow connects to your YouTube channels using the official YouTube Data API v3 and Google OAuth 2.0. We request the minimum scopes needed: read-only access to view comment threads, and write access to post replies on your behalf.
            </p>
            <p>
              We encrypt all YouTube access and refresh tokens at rest using advanced AES-256 standards. We do not store or access your Google account password under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">3. Your Control & Data Rights</h2>
            <p>
              You maintain absolute control over your YouTube channel permissions. You can disconnect your channels in the TubeFlow dashboard at any time, which deletes all access tokens from our database immediately.
            </p>
            <p>
              You can also revoke all YouTube Data API access tokens granted to TubeFlow permanently at any time by visiting the Google Security settings page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">4. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding your personal information, please feel free to reach out to us:
            </p>
            <p className="font-semibold text-google-blue">
              Email: hello@tubeflow.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
