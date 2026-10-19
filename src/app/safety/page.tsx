import React from "react";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-float">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        
        <div>
          <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Safety Protocols</span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading mt-1">
            Volunteer Health & Hazardous Waste Safety
          </h1>
        </div>

        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-800 dark:text-red-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-base text-red-700 dark:text-red-200">
            <ShieldAlert className="w-5 h-5" />
            <span>Hazardous & Medical Waste Warning</span>
          </div>
          <p>
            Citizens and volunteers must NEVER directly touch, handle, or attempt to bag medical refuse (needles, scalpels, biological swabs), toxic chemicals, corrosive car batteries, or large animal carcasses. These require certified municipal decontamination squads. Tag them as &apos;Medical&apos; or &apos;Hazardous&apos; in the app for specialized response.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Essential Volunteer Safety Gear Checklist
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              <span>Heavy-duty puncture-resistant nitrile or leather gloves.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              <span>Sturdy closed-toe shoes or boots; never sandals or open footwear.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              <span>Mechanical litter grabbers or tongs to pick up sharp items.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              <span>High-visibility neon vests when cleaning road curbs or flyover underpasses.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
