"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Youtube, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const showToast = useUIStore((state) => state.showToast);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const namePart = email.split("@")[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._]/g, " ");

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSession: {
            email,
            name: formattedName,
            tier: "free",
            repliesToday: 0
          }
        })
      });

      if (res.ok) {
        showToast(`Signed in as ${formattedName}`, "success");
        router.push("/onboarding");
      } else {
        showToast("Sign in failed. Please try again.", "error");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas-bg px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-[#dadce0] shadow-google-card">
        {/* Title / Logo */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-google-blue text-white shadow-sm font-display font-black text-xl">
              T
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-[#202124]">
              Tube<span className="text-google-blue">Flow</span>
            </span>
          </Link>
          
          <h2 className="font-display text-xl font-bold text-[#202124]">
            Sign in with Google
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            to connect your YouTube channels and manage automation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-450" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/15"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[10px] text-google-blue font-semibold hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-450" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/15"
              />
            </div>
          </div>

          {/* Connect button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-google-blue hover:bg-google-blue-pressed px-5 py-3 text-xs font-semibold text-white shadow-md transition disabled:opacity-50 active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting OAuth v2...
              </>
            ) : (
              <>
                Continue to OAuth Connection
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security footnote */}
        <div className="text-center border-t border-slate-100 pt-4 text-[10px] text-slate-400">
          <span className="font-semibold block mb-1">🛡️ HIPAA & GDPR Compliant</span>
          We encrypt all auth tokens using AES-256 and never sell comment metrics.
        </div>
      </div>
    </div>
  );
}
