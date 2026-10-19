"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Plus, Calendar, Award } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { useTranslation } from "@/lib/i18n";

export const MobileTabBar: React.FC = () => {
  const pathname = usePathname();
  const { currentCity } = useLocation();
  const { t } = useTranslation();

  const isMap = pathname.startsWith("/map");
  const isReport = pathname === "/report";
  const isEvents = pathname.startsWith("/events");
  const isImpact = pathname.startsWith("/impact");

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-emerald-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Map */}
        <Link
          href={`/map/${currentCity.id}`}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            isMap ? "text-primary dark:text-emerald-400 font-bold" : "text-gray-500 dark:text-gray-400 hover:text-primary"
          }`}
        >
          <MapPin className={`w-5 h-5 ${isMap ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] mt-0.5">{t("navMap")}</span>
        </Link>

        {/* Floating Report Button */}
        <Link
          href="/report"
          className="relative -top-4 flex flex-col items-center group"
          aria-label="Report Garbage"
        >
          <div className="w-13 h-13 p-3 rounded-full bg-gradient-to-tr from-primary to-accent text-white shadow-float group-hover:scale-105 active:scale-95 transition-transform flex items-center justify-center border-4 border-white dark:border-slate-900">
            <Plus className="w-7 h-7 stroke-[3]" />
          </div>
          <span className="text-[11px] font-bold text-primary dark:text-emerald-400 mt-0.5">
            {t("navReport")}
          </span>
        </Link>

        {/* Events */}
        <Link
          href="/events"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            isEvents ? "text-primary dark:text-emerald-400 font-bold" : "text-gray-500 dark:text-gray-400 hover:text-primary"
          }`}
        >
          <Calendar className={`w-5 h-5 ${isEvents ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] mt-0.5">{t("navEvents")}</span>
        </Link>

        {/* Profile / Impact */}
        <Link
          href="/impact"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            isImpact ? "text-primary dark:text-emerald-400 font-bold" : "text-gray-500 dark:text-gray-400 hover:text-primary"
          }`}
        >
          <Award className={`w-5 h-5 ${isImpact ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[11px] mt-0.5">{t("navImpact")}</span>
        </Link>
      </div>
    </div>
  );
};
