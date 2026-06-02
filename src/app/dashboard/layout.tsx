"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CommandPalette from "@/components/CommandPalette";
import { useUIStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toast = useUIStore((state) => state.toast);
  const hideToast = useUIStore((state) => state.hideToast);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas-bg font-sans">
      {/* 1. App Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main content area */}
      <div className="flex flex-col flex-1 h-full min-w-0 md:pl-[72px] lg:pl-[240px]">
        {/* Top Header */}
        <Header />

        {/* Scrollable Canvas area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-canvas-bg">
          {children}
        </main>
      </div>

      {/* 3. Global Command Palette Modal */}
      <CommandPalette />

      {/* 4. Global Toast Notifications banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-google-modal max-w-sm text-xs font-semibold
              ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}
              ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : ""}
              ${toast.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" : ""}
              ${toast.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" : ""}
            `}
          >
            {toast.type === "success" && <CheckCircle className="h-4.5 w-4.5 text-accent-success shrink-0" />}
            {toast.type === "error" && <AlertCircle className="h-4.5 w-4.5 text-accent-danger shrink-0" />}
            {toast.type === "warning" && <Info className="h-4.5 w-4.5 text-accent-warning shrink-0" />}
            {toast.type === "info" && <Info className="h-4.5 w-4.5 text-google-blue shrink-0" />}
            
            <span className="flex-1 text-left">{toast.message}</span>
            
            <button 
              onClick={hideToast}
              className="rounded-lg p-0.5 hover:bg-black/5 text-slate-400 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
