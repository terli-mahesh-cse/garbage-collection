import React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
        <WifiOff className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-heading">
        You are currently offline
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm mt-2">
        Garbage Collection PWA caches your essential map views. Any reports made offline will automatically sync once your connection is restored.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-soft hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Return Home</span>
      </Link>
    </div>
  );
}
