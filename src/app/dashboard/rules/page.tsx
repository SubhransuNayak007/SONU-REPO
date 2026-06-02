"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/store";
import { 
  Sliders, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit3,
  CheckCircle,
  HelpCircle,
  Eye,
  Settings,
  AlertCircle
} from "lucide-react";

interface Condition {
  id: string;
  type: "contains" | "equals" | "starts_with";
  value: string;
}

interface Rule {
  id: string;
  name: string;
  isActive: boolean;
  priority: number;
  colorLabel: "red" | "blue" | "yellow" | "green";
  conditions: Condition[];
  operator: "AND" | "OR";
  delaySeconds: number;
  dailyLimit: number;
}

export default function RulesListPage() {
  const router = useRouter();
  const showToast = useUIStore((state) => state.showToast);
  const triggerRefresh = useUIStore((state) => state.triggerRefresh);
  const refreshTrigger = useUIStore((state) => state.refreshTrigger);

  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  // Load rules
  useEffect(() => {
    async function fetchRules() {
      try {
        const res = await fetch("/api/rules");
        if (res.ok) {
          setRules(await res.json());
        }
      } catch (err) {
        console.error("Error fetching rules:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRules();
  }, [refreshTrigger]);

  const handleToggleActive = async (ruleId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/rules/${ruleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        showToast("Rule status updated.", "success");
        triggerRefresh();
      }
    } catch (err) {
      console.error("Error toggling active state:", err);
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    try {
      const res = await fetch(`/api/rules/${ruleId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("Rule deleted and priorities re-ordered.", "success");
        triggerRefresh();
      }
    } catch (err) {
      console.error("Error deleting rule:", err);
    }
  };

  const handleReorder = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= rules.length) return;

    const reordered = [...rules];
    // Swap items
    const temp = reordered[currentIndex];
    reordered[currentIndex] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Build array of IDs in new order
    const orderedIds = reordered.map((r) => r.id);

    try {
      const res = await fetch("/api/rules/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleIds: orderedIds })
      });

      if (res.ok) {
        showToast("Priority updated successfully.", "success");
        triggerRefresh();
      }
    } catch (err) {
      console.error("Reorder rules error:", err);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-lg font-bold text-[#202124] md:text-xl">
            Keyword Auto-Reply Rules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rules are evaluated in priority order (higher priority evaluated first). Drag or move rules to sort.
          </p>
        </div>

        <Link
          href="/dashboard/rules/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-google-blue hover:bg-google-blue-pressed text-xs font-semibold text-white px-5 py-2.5 shadow-sm transition active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create Rule
        </Link>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {loading ? (
          <div className="h-40 rounded-xl border bg-white flex items-center justify-center text-xs text-slate-400">
            Fetching rules list...
          </div>
        ) : rules.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-[#dadce0] bg-white p-12 text-center">
            <Sliders className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700">No Rules Found</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">You have not created any auto-reply keyword rules yet.</p>
            <Link
              href="/dashboard/rules/new"
              className="inline-flex items-center gap-1 rounded-full bg-google-blue text-xs font-semibold text-white px-5 py-2 shadow-sm"
            >
              Configure First Rule
            </Link>
          </div>
        ) : (
          rules.map((rule, idx) => (
            <div
              key={rule.id}
              className={`rounded-xl border border-[#dadce0] bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-google-card
                ${!rule.isActive ? "opacity-65" : ""}
              `}
            >
              {/* Left side: Priority controls and rule info */}
              <div className="flex items-start sm:items-center gap-3">
                {/* Priority swap arrows */}
                <div className="flex flex-col gap-1 items-center shrink-0 bg-slate-50 border border-slate-150 rounded-lg p-1.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleReorder(idx, "up")}
                    className="rounded p-0.5 text-slate-450 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-20 transition"
                    title="Increase Priority"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-slate-600">P{rule.priority}</span>
                  <button
                    disabled={idx === rules.length - 1}
                    onClick={() => handleReorder(idx, "down")}
                    className="rounded p-0.5 text-slate-450 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-20 transition"
                    title="Decrease Priority"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-left space-y-1.5">
                  {/* Name badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0
                      ${rule.colorLabel === "red" ? "bg-accent-live" : ""}
                      ${rule.colorLabel === "blue" ? "bg-google-blue" : ""}
                      ${rule.colorLabel === "yellow" ? "bg-accent-warning" : ""}
                      ${rule.colorLabel === "green" ? "bg-accent-success" : ""}
                    `} />
                    <span className="font-display text-sm font-bold text-slate-800">{rule.name}</span>
                    {!rule.isActive && (
                      <span className="bg-slate-105 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Inactive</span>
                    )}
                  </div>

                  {/* Conditions text representation */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Matches:</span>
                    {rule.conditions.map((c) => (
                      <span
                        key={c.id}
                        className="bg-slate-100 border border-slate-150 rounded px-2 py-0.5 text-[10px] font-mono font-medium text-slate-650"
                      >
                        {c.type === "starts_with" ? "Starts:" : ""}{c.value}
                      </span>
                    ))}
                    {rule.conditions.length > 1 && (
                      <span className="text-[9px] font-bold text-google-blue bg-blue-50 px-1 py-0.5 rounded">{rule.operator}</span>
                    )}
                  </div>

                  {/* Meta stats */}
                  <div className="text-[10px] text-slate-500 font-medium">
                    Delay: {Math.round(rule.delaySeconds / 60)} min · Daily Cap: {rule.dailyLimit} replies
                  </div>
                </div>
              </div>

              {/* Right side Actions controls */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-3 sm:pt-0 sm:border-t-0">
                {/* Active switch */}
                <div className="flex items-center gap-2 mr-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Active</span>
                  <button
                    onClick={() => handleToggleActive(rule.id, rule.isActive)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
                      ${rule.isActive ? "bg-google-blue" : "bg-slate-200"}
                    `}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                        ${rule.isActive ? "translate-x-4" : "translate-x-0"}
                      `}
                    />
                  </button>
                </div>

                {/* Edit */}
                <button
                  onClick={() => router.push(`/dashboard/rules/${rule.id}`)}
                  className="rounded-full p-2 text-slate-450 hover:bg-slate-50 hover:text-slate-700 transition border border-transparent hover:border-slate-200 bg-white shadow-sm"
                  title="Edit Rule"
                >
                  <Edit3 className="h-4 w-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-accent-danger transition border border-transparent hover:border-red-200 bg-white shadow-sm"
                  title="Delete Rule"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
