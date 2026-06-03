"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas-bg font-sans p-6 sm:p-12 md:p-24 items-center">
      <div className="w-full max-w-3xl bg-white border border-[#dadce0] rounded-2xl shadow-google-card p-8 sm:p-12 text-left">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-google-blue hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="font-display text-2xl font-extrabold text-[#202124] sm:text-3xl mb-6">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mb-8 font-semibold">Last Updated: June 3, 2026</p>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the TubeFlow comment automation application, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you must immediately cease using the application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">2. OAuth Permissions & YouTube Integration</h2>
            <p>
              By connecting your YouTube channel, you grant TubeFlow OAuth 2.0 permissions to query, read, and write comment replies. You acknowledge that replies are automatically composed and posted according to the rules and templates defined in your dashboard.
            </p>
            <p>
              You agree to comply with YouTube's Developer Policies, Community Guidelines, and Terms of Service. TubeFlow is not responsible for any strikes, restrictions, or channel suspensions resulting from automated interactions that violate YouTube's guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">3. Humanization Delay & Limits</h2>
            <p>
              To protect your channel standing and avoid spam flags, TubeFlow provides adjustable comment response delays (humanization delays) and daily execution limit caps. It is your responsibility to select delay parameters that conform to platform safe use practices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">4. Disclaimers & Contact</h2>
            <p>
              TubeFlow is provided "as is" without warranty of any kind. We do not guarantee uninterrupted availability, and daily API quotas are subject to Google Cloud project limits.
            </p>
            <p>
              For support or billing enquiries, please contact:
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
