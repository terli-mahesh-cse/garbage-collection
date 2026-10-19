"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Award, 
  Flame, 
  Sparkles, 
  TreePine, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Trophy,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { mockStore } from "@/lib/data/mockStore";
import { TOP_CITIES_LEADERBOARD } from "@/lib/data/seedData";
import { TreeVisualizer } from "@/components/common/TreeVisualizer";
import { Report } from "@/types";
import { timeAgo } from "@/lib/utils";

// Dynamic import with ssr: false for Recharts
const ImpactChart = dynamic(
  () => import("@/components/impact/ImpactChart"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 flex items-center justify-center text-xs text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading impact analytics...
      </div>
    ),
  }
);

export default function ImpactPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentCity } = useLocation();

  const [userReports, setUserReports] = useState<Report[]>([]);

  useEffect(() => {
    const list = mockStore.getReports(currentCity.id);
    setUserReports(list.slice(0, 5));
  }, [currentCity]);

  const badges = [
    { title: "Reporter", icon: MapPin, color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300" },
    { title: "Cleaner", icon: CheckCircle2, color: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300" },
    { title: "Eco Hero", icon: Sparkles, color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300" },
    { title: `Streak ${user?.streak || 7}`, icon: Flame, color: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-emerald-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>Eco Karma & City Cleanliness Score</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-heading">
              {t("yourImpactTitle")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Track your environmental footprint, earn badges, and help {currentCity.name} climb the leaderboards.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 shadow-soft self-start sm:self-auto">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Karma</span>
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                {user?.points || 1300} points
              </span>
            </div>
          </div>
        </div>

        {/* Top Grid: Tree Visualizer & Impact Badges/Stats (matches PDF Page 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Growing Community Tree Component */}
          <div className="lg:col-span-5">
            <TreeVisualizer
              points={user?.points || 1300}
              level={user?.level || "Eco Hero"}
            />
          </div>

          {/* Right: Badges & Metric Cards */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges Strip */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Earned Badges & Streak
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xs ${b.color}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-black/20 flex items-center justify-center mb-1.5 shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm font-heading">{b.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Large Stat Cards (24 reports posted, 9 events joined, 38 kg waste cleaned) */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: "24", label: "reports posted", color: "text-emerald-600" },
                { val: "9", label: "events joined", color: "text-sky-600" },
                { val: "38 kg", label: "waste cleaned", color: "text-amber-600" },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 shadow-soft text-center"
                >
                  <span className={`text-2xl sm:text-4xl font-extrabold font-heading ${s.color} block`}>
                    {s.val}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Bottom Grid: 6-Month Chart & Top Cities Leaderboard (matches PDF Page 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Left: Recharts 6-Month Comparison */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-float border border-emerald-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                  {t("reportsCleanedRatio")}
                </h3>
                <p className="text-xs text-gray-500">
                  Monthly waste reporting versus resolved cleanups
                </p>
              </div>
            </div>

            <ImpactChart />
          </div>

          {/* Right: Top Cities This Month */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 shadow-float border border-emerald-100 dark:border-slate-700 space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                {t("topCities")}
              </h3>
              <p className="text-xs text-gray-500">
                National clean city points race
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              {TOP_CITIES_LEADERBOARD.map((city) => (
                <div key={city.rank} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white ${
                        city.rank === 1 ? "bg-amber-500" : city.rank === 2 ? "bg-sky-500" : city.rank === 3 ? "bg-emerald-600" : "bg-gray-400"
                      }`}>
                        {city.rank}
                      </span>
                      <span className="text-gray-900 dark:text-white">{city.name}</span>
                    </div>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400">
                      {city.points.toLocaleString()} pts
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(city.points / 5000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* My Reports Status Timeline */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft border border-emerald-100 dark:border-slate-700 space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-heading">
            My Recent Reports & Status Timeline
          </h3>

          <div className="space-y-3">
            {userReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-surface/30 dark:bg-slate-700/40 border border-emerald-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">{rep.address}</span>
                    <span className="text-gray-400 font-mono text-[10px]">#{rep.id}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{rep.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                    rep.status === "cleaned" 
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : rep.status === "in_progress"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300"
                  }`}>
                    {rep.status}
                  </span>
                  <span className="text-gray-400 text-[11px] whitespace-nowrap">
                    {timeAgo(rep.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
