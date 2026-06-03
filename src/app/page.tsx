"use client";

import React, { useState, useEffect } from "react";
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
  Settings,
  Shield
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  
  // Pricing toggle state
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // React state for accordion (in addition to requested pure JS/CSS listener fallback)
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Custom states for Option B animated preview
  const [demoIdx, setDemoIdx] = useState(0);
  const [demoStep, setDemoStep] = useState(0); // 0: received, 1: matching, 2: typing, 3: queued
  const [demoTypedText, setDemoTypedText] = useState("");

  const features = [
    { title: "Smart Keyword Matching", desc: "Evaluate comments against priority keyword patterns with advanced AND/OR criteria.", icon: MessageSquare },
    { title: "Intelligent Auto-Replies", desc: "Compose customizable reply templates or leverage AI variant generators for natural flows.", icon: Sparkles },
    { title: "Humanization Delays", desc: "Apply 2-10 minutes delayed schedules to auto-replies, avoiding platform spam flags.", icon: Clock },
    { title: "Collaborative Workspaces", desc: "Add managers, editors, or reviewers to inspect comment logs and moderate rules.", icon: Users },
    { title: "Spam & Troll Moderation", desc: "Enable automated filters to hold toxic comments and ignore spam bot IDs.", icon: ShieldCheck },
    { title: "Analytics Overview", desc: "Track replies dispatched, time hours saved, and top keyword triggers inside neat charts.", icon: TrendingUp },
  ];

  const faqs = [
    { 
      q: "Is TubeFlow approved by YouTube?", 
      a: "Yes, TubeFlow is fully compliant with YouTube's Developer Policies. We connect to your channel using the official Google OAuth 2.0 gateway and communicate via the secure YouTube Data API v3. Your account password is never shared with us, and you can revoke our API access at any moment directly from your Google Security Settings page. We encrypt all access tokens at rest using AES-256 standards to keep your channel secure." 
    },
    { 
      q: "How does the AI suggestion engine work?", 
      a: "TubeFlow monitors your YouTube channel's comments in real-time. When a comment is detected, it is matched against your custom keyword rules and pricing patterns. If a match is found, our advanced AI model evaluates the context and generates a personalized response that aligns with your guidelines. The drafted reply is then placed in your dashboard queue for approval or dispatched directly based on your rules." 
    },
    { 
      q: "Can I manage multiple YouTube channels?", 
      a: "Yes, you can easily link and manage multiple channels from a single dashboard. Our Creator Pro plan allows you to automate up to 3 separate YouTube channels, while the Agency plan offers unlimited channel connections. Once linked, you can toggle between different channel feeds using the sidebar selector. Each channel can have its own independent set of rules, keyword patterns, and reply templates." 
    },
    { 
      q: "What happens if I exceed my daily quota limit?", 
      a: "In the event that the official YouTube API daily quota is reached, TubeFlow will gracefully pause automatic replies. We will display a clear notification in your dashboard header to keep you informed of the quota status. During this pause, all incoming comments are stored safely in a queue on our servers. As soon as Google resets the daily quota limit, TubeFlow will resume automated operations and process the queued comments." 
    }
  ];

  const demoScenarios = [
    {
      author: "Alex Rivers",
      time: "Just now",
      text: "Can I try this for free before buying? Also, does it support humanization delay?",
      rule: "Free Trial",
      reply: "Hi Alex! Yes, we have a 14-day free trial on our Creator Pro plan, which supports up to 10 minutes of humanization delay to keep your channel safe."
    },
    {
      author: "TechVibe Studio",
      time: "2m ago",
      text: "Is there a coupon or discount code for the annual plan? Really love the product!",
      rule: "Discount Promo",
      reply: "Hi TechVibe! Thank you for the support. Use coupon code TUBE10 at checkout to save 10% on any of our subscription tiers."
    },
    {
      author: "Sarah Jenkins",
      time: "5m ago",
      text: "Do you have an agency tier for managing 10+ creator channels?",
      rule: "Agency Inquiries",
      reply: "Hi Sarah! Yes, our Agency Net tier supports unlimited channels and team members. Feel free to reach out to sales for a custom demo!"
    },
    {
      author: "Devon C.",
      time: "8m ago",
      text: "Does this require my channel password? I am a bit worried about security.",
      rule: "Security Q&A",
      reply: "Hey Devon! TubeFlow uses official Google OAuth 2.0 authorization, which means we never see or store your channel password."
    },
    {
      author: "Marina Lopez",
      time: "12m ago",
      text: "Can I set up custom replies for generic questions like what camera do you use?",
      rule: "Custom Rules",
      reply: "Hi Marina! Yes, you can configure custom rules matching keyword groups such as 'camera' or 'lens' to fire tailored templates automatically."
    }
  ];

  // Typing simulator state machine for Option B product demo mockup
  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;

    const runScenario = (index: number) => {
      const scenario = demoScenarios[index];
      setDemoStep(0);
      setDemoTypedText("");

      // Step 0 -> Step 1 (Matching) after 1.5s
      stepTimer = setTimeout(() => {
        setDemoStep(1);

        // Step 1 -> Step 2 (Typing) after 1.5s
        stepTimer = setTimeout(() => {
          setDemoStep(2);
          let charIndex = 0;
          const fullText = scenario.reply;
          
          typingInterval = setInterval(() => {
            if (charIndex <= fullText.length) {
              setDemoTypedText(fullText.slice(0, charIndex));
              charIndex += 2; // smooth double char step
            } else {
              clearInterval(typingInterval);
              setDemoStep(3);

              // Step 3 -> Next Scenario after 3s
              stepTimer = setTimeout(() => {
                setDemoIdx((prev) => (prev + 1) % demoScenarios.length);
              }, 3000);
            }
          }, 35);
        }, 1500);
      }, 1500);
    };

    runScenario(demoIdx);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(typingInterval);
    };
  }, [demoIdx]);

  // Setup click listeners for pure JS/CSS accordion questions (as requested in Critical Bug 5)
  useEffect(() => {
    const handleFaqClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const parent = target.parentElement;
      if (parent) {
        parent.classList.toggle("open");
      }
    };

    const questions = document.querySelectorAll(".faq-question");
    questions.forEach(q => {
      q.addEventListener("click", handleFaqClick);
    });

    return () => {
      questions.forEach(q => {
        q.removeEventListener("click", handleFaqClick);
      });
    };
  }, []);

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
            href="/signup" 
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
              onClick={() => router.push("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-google-blue hover:bg-google-blue-pressed px-7 py-3 text-sm font-semibold text-white transition active:scale-95 shadow-lg w-full sm:w-auto"
            >
              Start for free
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <span className="text-xs text-slate-400 font-semibold">No credit card required.</span>
          </div>
        </div>

        {/* Live Mock Dashboard preview block - Option B Animated Mockup */}
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

            {/* Comment snippet cards (3 comments total) */}
            <div className="space-y-3 font-sans">
              {/* Comment 1: Static */}
              <div className="border-l-4 border-l-accent-success bg-slate-850/50 rounded-lg p-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">Mark A.</span>
                    <span className="text-[10px] text-slate-500">2m ago</span>
                  </div>
                  <p className="text-slate-300 italic text-xs">&ldquo;Hey! Does this work for multiple YouTube channels?&rdquo;</p>
                  <p className="text-[10px] text-accent-success font-semibold">Reply Fired: &ldquo;Hi Mark! Yes, our Creator Pro plan supports up to 3 channels, and Agency Net supports unlimited channels.&rdquo;</p>
                </div>
                <span className="bg-green-500/10 text-green-400 border border-green-500/25 text-[9px] font-semibold px-2 py-0.5 rounded">Dispatched</span>
              </div>

              {/* Comment 2: Static */}
              <div className="border-l-4 border-l-accent-success bg-slate-850/50 rounded-lg p-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">Clara Oswald</span>
                    <span className="text-[10px] text-slate-500">5m ago</span>
                  </div>
                  <p className="text-slate-400 italic text-xs">&ldquo;Is there a discount promo code?&rdquo;</p>
                  <p className="text-[10px] text-accent-success font-semibold">Reply Fired: &ldquo;Hi Clara! Thanks for watching. Use code YOUTUBE10 for 10% off at checkout.&rdquo;</p>
                </div>
                <span className="bg-green-500/10 text-green-400 border border-green-500/25 text-[9px] font-semibold px-2 py-0.5 rounded">Dispatched</span>
              </div>

              {/* Comment 3: Animated Scenarios (Live Carousel) */}
              <div className="border-l-4 border-l-google-blue bg-slate-850/50 rounded-lg p-3 flex items-start justify-between gap-4 transition-all duration-300">
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{demoScenarios[demoIdx].author}</span>
                    <span className="text-[10px] text-slate-500">{demoScenarios[demoIdx].time}</span>
                  </div>
                  <p className="text-slate-350 italic text-xs">&ldquo;{demoScenarios[demoIdx].text}&rdquo;</p>
                  
                  {/* Evaluating indicator */}
                  {demoStep === 1 && (
                    <p className="text-[10px] text-yellow-400 font-bold animate-pulse">
                      Evaluating rules... Matched: {demoScenarios[demoIdx].rule}
                    </p>
                  )}

                  {/* Typing draft reply */}
                  {demoStep >= 2 && (
                    <div className="bg-slate-900 border border-slate-750 p-2.5 rounded-lg text-[10px] text-slate-300 italic font-mono relative">
                      <span className="font-bold text-google-blue not-mono block mb-1">AI suggestion editor:</span>
                      &ldquo;{demoTypedText}
                      {demoStep === 2 && <span className="animate-ping font-bold">|</span>}&rdquo;
                    </div>
                  )}

                  {/* Execution delayed timers */}
                  {demoStep === 3 && (
                    <p className="text-[10px] text-google-blue font-bold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-google-blue live-pulse" />
                      <span>Queued reply · Dispatching in 2m 59s delay (humanization rule)</span>
                    </p>
                  )}
                </div>
                
                {/* Right side badge */}
                <div className="shrink-0">
                  {demoStep === 3 ? (
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[9px] font-semibold px-2 py-0.5 rounded">Queued</span>
                  ) : (
                    <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 text-[9px] font-semibold px-2 py-0.5 rounded">Received</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-white text-center flex flex-col items-center">
        <h2 className="font-display text-2xl font-extrabold text-[#202124] sm:text-3xl">
          Automate Comments in 3 Steps
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          See how easily TubeFlow takes over your YouTube comments moderation.
        </p>

        <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto mt-12 w-full">
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

        {/* API Compliance trust Statement Strip */}
        <div className="mt-12 inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-5 py-2.5 text-xs text-slate-650 font-semibold max-w-2xl mx-auto shadow-sm">
          <span>🔒 Uses official YouTube Data API v3 · OAuth 2.0 auth · No password stored · Channel access revokable anytime from Google</span>
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

      {/* Social Proof */}
      <section className="py-16 px-6 lg:px-12 bg-canvas-bg border-y border-[#dadce0] text-center">
        {/* Stat Bar */}
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl py-6 px-8 shadow-xl text-white mb-16 flex flex-col md:flex-row justify-around items-center gap-6">
          <div className="space-y-1">
            <span className="block text-2xl font-black text-google-blue">1,240+</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Auto-replies Sent</span>
          </div>
          <div className="h-px w-12 bg-slate-800 md:h-8 md:w-px" />
          <div className="space-y-1">
            <span className="block text-2xl font-black text-google-blue">47</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Creators</span>
          </div>
          <div className="h-px w-12 bg-slate-800 md:h-8 md:w-px" />
          <div className="space-y-1">
            <span className="block text-2xl font-black text-google-blue">89 Hrs</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Saved This Month</span>
          </div>
        </div>

        {/* Testimonials */}
        <h3 className="font-display text-xl font-bold text-[#202124] md:text-2xl mb-2">
          Trusted by Channels of All Sizes
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-10">
          See how professional content creators are reclaiming hours spent moderating comments.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm text-left flex flex-col justify-between">
            <p className="text-xs text-slate-650 leading-relaxed italic mb-6">
              "TubeFlow handles 80% of my comment replies automatically. I used to spend 2hrs a day — now it's 15 minutes."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-google-blue border text-xs">
                RM
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-800">Rahul M.</span>
                <span className="text-[10px] text-slate-400 font-semibold">45K subscribers</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm text-left flex flex-col justify-between">
            <p className="text-xs text-slate-650 leading-relaxed italic mb-6">
              "As a tech reviewer, I get hundreds of questions about specs. TubeFlow replies to them instantly using my affiliate links, boosting my revenue by 30%!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-google-blue border text-xs">
                SK
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-800">Sarah K.</span>
                <span className="text-[10px] text-slate-400 font-semibold">120K subscribers</span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm text-left flex flex-col justify-between">
            <p className="text-xs text-slate-650 leading-relaxed italic mb-6">
              "Managing comment moderation was a nightmare until I found TubeFlow. It holds spam and toxic comments in review while automatically thanking my patrons."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-google-blue border text-xs">
                DL
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-800">David L.</span>
                <span className="text-[10px] text-slate-400 font-semibold">85K subscribers</span>
              </div>
            </div>
          </div>
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

        {/* Currency Switcher */}
        <div className="flex justify-center mt-6 mb-8">
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setCurrency('INR')}
              className={`rounded-md px-3.5 py-1.5 font-semibold transition cursor-pointer active:scale-95 ${
                currency === 'INR' ? 'bg-white text-google-blue shadow-sm font-bold' : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`rounded-md px-3.5 py-1.5 font-semibold transition cursor-pointer active:scale-95 ${
                currency === 'USD' ? 'bg-white text-google-blue shadow-sm font-bold' : 'text-slate-555 hover:text-slate-800'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-xl border border-[#dadce0] bg-white p-6 shadow-sm flex flex-col justify-between text-left">
            <div>
              <h4 className="font-bold text-slate-500 text-sm uppercase">Free Starter</h4>
              <div className="flex items-baseline mt-4 mb-2">
                <span className="text-3xl font-extrabold text-[#202124]">
                  {currency === 'INR' ? '₹0' : '$0'}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Perfect for checking out keyword rules.</p>
              <ul className="text-xs text-slate-650 space-y-2 mt-6">
                <li className="flex items-center gap-2">✓ 1 YouTube Channel</li>
                <li className="flex items-center gap-2">✓ 10 Auto-Replies / day</li>
                <li className="flex items-center gap-2">✓ 3 Keyword Rules</li>
                <li className="flex items-center gap-2">✓ Full Auto-Reply Automation</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push("/signup")}
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
                <span className="text-3xl font-extrabold text-[#202124]">
                  {currency === 'INR' ? '₹99' : '$1.19'}
                </span>
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
              onClick={() => router.push("/signup")}
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
                <span className="text-3xl font-extrabold text-[#202124]">
                  {currency === 'INR' ? '₹299' : '$3.59'}
                </span>
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
            <a 
              href="mailto:hello@tubeflow.com"
              className="w-full text-center py-2.5 rounded-full border border-slate-900 text-slate-900 hover:bg-slate-50 text-xs font-semibold mt-8 transition block"
            >
              Contact Sales
            </a>
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
                className={`faq-item rounded-xl border border-[#dadce0] bg-white text-left overflow-hidden transition-all shadow-sm ${isOpen ? "open" : ""}`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="faq-question flex w-full items-center justify-between p-4 font-bold text-slate-800 text-sm outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                
                <div className="faq-answer p-4 pt-0 text-xs text-slate-500 border-t border-slate-50 leading-relaxed bg-slate-50/50">
                  {faq.a}
                </div>
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
              onClick={() => router.push("/signup")}
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
          <Link href="/privacy" className="hover:text-google-blue">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-google-blue">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
