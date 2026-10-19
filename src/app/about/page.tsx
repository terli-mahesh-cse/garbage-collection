import React from "react";
import Link from "next/link";
import { TreePine, ShieldCheck, Heart, Sparkles, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-float">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        
        <div>
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">About Us</span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading mt-1">
            Garbage Collection: Spot it. Post it. Clean it together.
          </h1>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Garbage Collection is an open civic technology initiative designed to bridge the gap between conscientious citizens, grassroots volunteer organizations, and municipal sanitary corporations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-surface/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">Citizen Empowerment</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Transforming passive observation into measurable community action through geotagged reporting and Sunday clean drives.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-surface/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">Municipal Synergy</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Providing ward commissioners with actionable hotspot heatmaps, automated notifications, and faster dispatch verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
