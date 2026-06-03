"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Youtube, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Users, 
  ChevronDown, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Settings
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    { title: "Smart Keyword Matching", desc: "Evaluate comments against priority keyword patterns with advanced AND/OR criteria.", icon: MessageSquare },
    { title: "Intelligent Auto-Replies", desc: "Compose customizable reply templates or leverage AI variant generators for natural flows.", icon: Sparkles },
    { title: "Humanization Delays", desc: "Apply 2-10 minutes delayed schedules to auto-replies, avoiding platform spam flags.", icon: Clock },
    { title: "Collaborative Workspaces", desc: "Add managers, editors, or reviewers to inspect comment logs and moderate rules.", icon: Users },
    { title: "Spam & Troll Moderation", desc: "Enable automated filters to hold toxic comments and ignore spam bot IDs.", icon: ShieldCheck },
    { title: "Analytics Overview", desc: "Track replies dispatched, time hours saved, and top keyword triggers inside neat charts.", icon: TrendingUp },
  ];

  const faqs = [
    { q: "Is TubeFlow approved by YouTube?", a: "Yes. TubeFlow integrates using the official YouTube Data API v3 and complies fully with YouTube's Developer Policies. Your tokens are securely encrypted at rest." },
    { q: "How does the AI suggestion engine work?", a: "TubeFlow reads your rules database and evaluates comments. It leverages Claude models to generate refined, context-appropriate responses matching your custom templates." },
    { q: "Can I manage multiple YouTube channels?", a: "Absolutely. Our Pro and Agency plans support multiple channels inside a single workspace, allowing you to toggle feeds from the sidebar." },
    { q: "What happens if I exceed my daily quota limit?", a: "If your YouTube API quota limit is reached, TubeFlow alerts you in the dashboard header, holds comments in queue, and automatically resumes polling once the daily quota resets." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-canvas-bg font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#dadce0] bg-white/95 backdrop-blur px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-google-blue text-white shadow-sm font-display font-black text-xl">
            T
          </div>
          <span className="font-display text-base font-bold tracking-tight text-[#202124]">
            Tube<span className="text-google-blue">Flow</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-google-blue">How It Works</a>
          <a href="#features" className="hover:text-google-blue">Features</a>
          <a href="#pricing" className="hover:text-google-blue">Pricing</a>
          <a href="#faqs" className="hover:text-google-blue">FAQs</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs font-semibold text-slate-600 hover:text-google-blue px-3 py-2">
            Sign In
          </Link>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1 rounded-full bg-google-blue hover:bg-google-blue-pressed text-xs font-semibold text-white px-5 py-2 transition shadow-sm"
          >
            Start Free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-6 lg:px-12 text-center flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(#3c4043_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <Cpu className="h-3.5 w-3.5 text-blue-400" />
            <span>AI-Driven Comment Management</span>
          </div>
          
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight text-white">
            Your YouTube Comments,<br />
            <span className="text-google-blue">Finally Under Control.</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
            TubeFlow watches every comment on your channel 24/7. When someone asks about pricing, support, or promo discount codes — it replies instantly, in your voice.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 rounded-full bg-google-blue hover:bg-google-blue-pressed px-7 py-3 text-sm font-semibold text-white transition active:scale-95 shadow-lg w-full sm:w-auto"
            >
              Start for free
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <span className="text-xs text-slate-400 font-semibold">No credit card required.</span>
          </div>
        </div>

        {/* Live Mock Dashboard preview block */}
        <div className="relative mt-16 max-w-5xl w-full border border-slate-700/80 rounded-xl bg-slate-800 shadow-2xl p-2.5 overflow-hidden">
          <div className="flex h-5 items-center gap-1.5 px-3 mb-2 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
          </div>
          <div className="rounded-lg overflow-hidden border border-slate-750 bg-slate-900 text-left p-4 sm:p-6 text-xs sm:text-sm text-slate-300">
            {/* Header snippet */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                <span className="font-bold text-slate-100">TubeFlow Dashboard preview</span>
              </div>
              <span className="bg-red-500/10 text-red-400 font-bold border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] live-pulse">🔴 LIVE FEED</span>
            </div>

            {/* Comment snippet cards */}
            <div className="space-y-3 font-sans">
              <div className="border-l-4 border-l-google-blue bg-slate-850/50 rounded-lg p-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">John Doe</span>
                    <span className="text-[10px] text-slate-500">2m ago</span>
                  </div>
                  <p className="text-slate-300 italic text-xs">&ldquo;How much does the premium workspace cost?&rdquo;</p>
                  <p className="text-[10px] text-google-blue font-bold">Matched Rule: Pricing Keywords · Dispatching reply in 1m 12s</p>
                </div>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[9px] font-semibold px-2 py-0.5 rounded">Queued</span>
              </div>

              <div className="border-l-4 border-l-accent-success bg-slate-850/50 rounded-lg p-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">Clara Oswald</span>
                    <span className="text-[10px] text-slate-500">5m ago</span>
                  </div>
                  <p className="text-slate-400 italic text-xs">&ldquo;Is there a discount promo code?&rdquo;</p>
                  <p className="text-[10px] text-accent-success font-semibold">Reply Fired: &ldquo;Hi Clara! Thanks for watching. Use code YOUTUBE10 for 10% off...&rdquo;</p>
                </div>
                <span className="bg-green-500/10 text-green-400 border border-green-500/25 text-[9px] font-semibold px-2 py-0.5 rounded">Dispatched</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-white text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#202124] sm:text-3xl">
          Automate Comments in 3 Steps
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          See how easily TubeFlow takes over your YouTube comments moderation.
        </p>

        <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto mt-12">
          {/* Card 1 */}
          <div className="flex flex-col items-center p-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-display text-base font-bold text-google-blue">
              1
            </div>
            <h4 className="font-bold text-[#202124] mt-4">Connect Account</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Securely sign-in with your Google account. Connect one or multiple YouTube channels in 1-click.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center p-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-display text-base font-bold text-google-blue">
              2
            </div>
            <h4 className="font-bold text-[#202124] mt-4">Compose Rules</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Design rules targeting pricing keywords or product links, and assign customized template replies.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center p-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-display text-base font-bold text-google-blue">
              3
            </div>
            <h4 className="font-bold text-[#202124] mt-4">Set Auto-Reply</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Sit back as incoming comments trigger instant or human-delayed responses on autopilot.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-canvas-bg text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#202124] sm:text-3xl">
          Everything You Need to Automate Interaction
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Built for growth teams, content creators, and marketing departments.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mt-12">
          {features.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-[#dadce0] bg-white p-5 shadow-sm hover:shadow-google-card transition text-left flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-blue-50 border border-blue-150 rounded-lg flex items-center justify-center text-google-blue">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12 bg-white text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#202124] sm:text-3xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Scale your comment replies automatically as your channel grows.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto mt-12">
          {/* Free Tier */}
          <div className="rounded-xl border border-[#dadce0] bg-white p-6 shadow-sm flex flex-col justify-between text-left">
            <div>
              <h4 className="font-bold text-slate-500 text-sm uppercase">Free Starter</h4>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="text-3xl font-extrabold text-[#202124]">$0</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Perfect for checking out keyword rules.</p>
              <ul className="text-xs text-slate-650 space-y-2 mt-6">
                <li className="flex items-center gap-2">✓ 1 YouTube Channel</li>
                <li className="flex items-center gap-2">✓ 50 Auto-Replies / mo</li>
                <li className="flex items-center gap-2">✓ 3 Keyword Rules</li>
                <li className="flex items-center gap-2">✓ Manual Review Queue</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push("/login")}
              className="w-full text-center py-2.5 rounded-full border border-google-blue text-google-blue hover:bg-blue-50 text-xs font-semibold mt-8 transition"
            >
              Get Started
            </button>
          </div>

          {/* Pro Tier (Recommended) */}
          <div className="rounded-xl border-2 border-google-blue bg-white p-6 shadow-md flex flex-col justify-between text-left relative">
            <span className="absolute -top-3 left-6 rounded-full bg-google-blue text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1">
              Recommended
            </span>
            <div>
              <h4 className="font-bold text-google-blue text-sm uppercase">Creator Pro</h4>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="text-3xl font-extrabold text-[#202124]">₹99</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">For professional creators and brands.</p>
              <ul className="text-xs text-slate-650 space-y-2 mt-6">
                <li className="flex items-center gap-2">✓ 3 YouTube Channels</li>
                <li className="flex items-center gap-2">✓ Unlimited Replies</li>
                <li className="flex items-center gap-2">✓ Unlimited Keyword Rules</li>
                <li className="flex items-center gap-2">✓ AI-Generated Draft Suggestions</li>
                <li className="flex items-center gap-2">✓ 3 Team Members</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push("/login")}
              className="w-full text-center py-2.5 rounded-full bg-google-blue hover:bg-google-blue-pressed text-white text-xs font-semibold mt-8 transition shadow-sm"
            >
              Start Free Trial
            </button>
          </div>

          {/* Agency Tier */}
          <div className="rounded-xl border border-[#dadce0] bg-white p-6 shadow-sm flex flex-col justify-between text-left">
            <div>
              <h4 className="font-bold text-slate-500 text-sm uppercase">Agency Net</h4>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="text-3xl font-extrabold text-[#202124]">$99</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">For agencies managing network portfolios.</p>
              <ul className="text-xs text-slate-650 space-y-2 mt-6">
                <li className="flex items-center gap-2">✓ Unlimited Channels</li>
                <li className="flex items-center gap-2">✓ Unlimited Replies</li>
                <li className="flex items-center gap-2">✓ Custom API Integrations</li>
                <li className="flex items-center gap-2">✓ Dedicated SLA Support</li>
                <li className="flex items-center gap-2">✓ Unlimited Team Members</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push("/login")}
              className="w-full text-center py-2.5 rounded-full border border-slate-900 text-slate-900 hover:bg-slate-50 text-xs font-semibold mt-8 transition"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 px-6 lg:px-12 bg-canvas-bg text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#202124] sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Read quick details about automation logic and quota queries.
        </p>

        <div className="max-w-2xl mx-auto mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="rounded-xl border border-[#dadce0] bg-white text-left overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 font-bold text-slate-800 text-sm outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-500 border-t border-slate-50 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA section Banner */}
      <section className="bg-slate-900 text-white py-16 px-6 text-center flex flex-col items-center">
        <div className="max-w-xl space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold">Ready to automate your engagement?</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Connect your channel today, save hours of manual review, and answer your subscriber pricing and coupon inquiries instantly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 rounded-full bg-google-blue hover:bg-google-blue-pressed px-7 py-3 text-sm font-semibold text-white shadow-md transition active:scale-95"
            >
              Start for free now
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-16 flex items-center justify-between border-t border-[#dadce0] bg-white px-6 lg:px-12 text-slate-400 text-[11px] font-semibold shrink-0">
        <span>© 2026 TubeFlow Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-google-blue">Privacy Policy</a>
          <a href="#" className="hover:text-google-blue">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
