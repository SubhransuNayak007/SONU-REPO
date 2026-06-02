"use client";

import React, { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store";
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Activity, 
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const activeChannelId = useUIStore((state) => state.activeChannelId);
  const showToast = useUIStore((state) => state.showToast);
  const router = useRouter();

  const [channelName, setChannelName] = useState("Loading Channel...");
  const [channelStatus, setChannelStatus] = useState("active");
  const refreshTrigger = useUIStore((state) => state.refreshTrigger);

  // Keyboard shortcut listener for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  // Fetch active channel info
  useEffect(() => {
    async function fetchActiveChannel() {
      try {
        const res = await fetch("/api/channels");
        if (res.ok) {
          const channels = await res.json();
          const current = channels.find((c: any) => c.id === activeChannelId);
          if (current) {
            setChannelName(current.name);
            setChannelStatus(current.status);
          }
        }
      } catch (err) {
        console.error("Error fetching header channel:", err);
      }
    }
    fetchActiveChannel();
  }, [activeChannelId, refreshTrigger]);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#dadce0] bg-white px-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] active:bg-[#e8eaed] md:hidden"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold text-[#202124] md:text-base hidden sm:inline-block">
            {channelName}
          </span>
          <span 
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
              ${channelStatus === "active" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200 live-pulse"}
            `}
          >
            {channelStatus === "active" ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-accent-success" />
                Live Polling
              </>
            ) : (
              <>
                <AlertTriangle className="h-2.5 w-2.5" />
                Quota Error
              </>
            )}
          </span>
        </div>
      </div>

      {/* Center: Command Palette Trigger Button */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex max-w-[320px] md:max-w-[400px] w-full items-center justify-between gap-3 rounded-full border border-[#dadce0] bg-[#f1f3f4] px-4 py-1.5 text-left text-xs text-[#5f6368] hover:bg-[#e8eaed] hover:border-[#bdc1c6] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search rules, templates, logs...</span>
        </div>
        <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#80868b] border border-[#dadce0] sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Right: Health Ticker & Quick actions */}
      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-2 border-r border-[#dadce0] pr-4 mr-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#5f6368]">
            <Activity className="h-3.5 w-3.5 text-google-blue" />
            <span>API Quota: <span className="font-semibold text-slate-800">92%</span></span>
          </div>
          <span className="text-[#dadce0] text-[10px]">•</span>
          <span className="text-[11px] font-medium text-accent-success flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-success live-pulse" />
            30s Sync
          </span>
        </div>

        <button 
          onClick={() => {
            router.push("/dashboard/channels");
            showToast("Opening channels onboarding page", "info");
          }}
          className="inline-flex items-center gap-1 rounded-full bg-google-blue px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-google-blue-pressed transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Connect Channel</span>
        </button>

        <button 
          onClick={() => showToast("No new notifications.", "info")}
          className="rounded-full p-2 text-[#5f6368] hover:bg-[#f1f3f4] relative transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-accent-live" />
        </button>
      </div>
    </header>
  );
}
