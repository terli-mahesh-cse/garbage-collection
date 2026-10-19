import React from "react";
import Link from "next/link";
import { Trash2, Home, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-slate-800 text-primary flex items-center justify-center mb-4 shadow-float border border-emerald-100 dark:border-slate-700">
        <Trash2 className="w-10 h-10 animate-bounce" />
      </div>
      <span className="text-xs uppercase font-extrabold text-primary tracking-widest">
        404 - Spot Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-heading mt-1">
        This area is spotless!
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mt-2 leading-relaxed">
        We couldn&apos;t find the page or report pin you were looking for. It may have been resolved, cleaned, or relocated.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-soft transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          href="/map/hyderabad"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs shadow-xs hover:bg-gray-50 transition-colors"
        >
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Open Live Map</span>
        </Link>
      </div>
    </div>
  );
}
