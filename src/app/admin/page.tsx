"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Building,
  Sparkles,
  Lock
} from "lucide-react";
import { mockStore } from "@/lib/data/mockStore";
import { useAuth } from "@/context/AuthContext";
import { Report, UserRole } from "@/types";

export default function PlatformAdminPage() {
  const { user, role, switchRole } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<"moderation" | "cities" | "users">("moderation");

  useEffect(() => {
    setReports(mockStore.getReports());
  }, []);

  const flaggedReports = reports.filter(r => r.stillDirtyCount > 2 || r.flagged);

  const handleDismissFlag = (repId: string) => {
    const rep = mockStore.getReportById(repId);
    if (rep) {
      rep.flagged = false;
      rep.stillDirtyCount = 0;
      setReports([...mockStore.getReports()]);
    }
  };

  const handleDeleteReport = (repId: string) => {
    // In mock store, update status or delete
    const rep = mockStore.getReportById(repId);
    if (rep) {
      rep.status = "cleaned";
      setReports([...mockStore.getReports()]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-emerald-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-heading">
              Admin & Content Moderation
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Oversee content moderation, manage civic boundaries, and configure authority permissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">Testing Persona:</span>
            <button
              onClick={() => switchRole("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                role === "admin" ? "bg-purple-600 text-white shadow-xs" : "bg-gray-100 text-gray-700"
              }`}
            >
              Admin Role Active
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-slate-800">
          {[
            { id: "moderation", label: `Moderation Queue (${flaggedReports.length})` },
            { id: "cities", label: "Managed Cities & Wards" },
            { id: "users", label: "Civic Staff & Permissions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-purple-600 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Moderation Queue */}
        {activeTab === "moderation" && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-float border border-emerald-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Reports with Citizen Flags or High Discrepancies
              </h3>
              <span className="text-xs text-gray-400">Automated spam & duplicate filter enabled</span>
            </div>

            <div className="space-y-3">
              {flaggedReports.length > 0 ? (
                flaggedReports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">{r.address}</span>
                        <span className="font-mono text-gray-400 text-[10px]">#{r.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {r.stillDirtyCount} flags
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{r.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDismissFlag(r.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold text-xs"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => handleDeleteReport(r.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
                      >
                        Remove Post
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-gray-700 dark:text-gray-300">Moderation Queue is Clean!</p>
                  <p className="text-xs">No pending abusive or flagged posts.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Managed Cities */}
        {activeTab === "cities" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockStore.getCities().map((c) => (
              <div key={c.id} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{c.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    Score {c.cleanlinessScore}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">{c.stateName}, {c.countryCode} • {c.wards.length} Wards configured</p>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900 text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
                  <strong>Authority Dispatch Email:</strong>
                  <div className="font-mono text-emerald-600 dark:text-emerald-400 truncate">{c.officerEmails[0]}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-soft border border-emerald-100 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Civic Staff & Role Assignments
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: "Dr. K. Srinivas Rao", email: "srinivas.ghmc@hyderabad.gov.in", role: "officer", city: "Hyderabad" },
                { name: "Anita Sharma", email: "admin@garbagecollection.in", role: "admin", city: "Hyderabad" },
                { name: "Ravi Kumar", email: "ravi.kumar@example.com", role: "citizen", city: "Hyderabad" },
              ].map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/40">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">{u.name}</span>
                    <span className="text-gray-400 font-mono text-[11px]">{u.email}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
