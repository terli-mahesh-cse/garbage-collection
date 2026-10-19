import React from "react";
import Link from "next/link";
import { EyeOff, MapPin, Lock, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-float">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        
        <div>
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Privacy & Trust</span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading mt-1">
            Citizen Privacy Policy & Identity Protection
          </h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-surface/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-primary" />
              <span>Face & License Plate Blurring</span>
            </h3>
            <p>
              We provide an integrated, in-browser privacy blurring brush on the reporting camera preview. Users are encouraged to blur any bystanders, vehicle registration plates, or residential nameplates before uploading.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Location Data & EXIF Geotags</span>
            </h3>
            <p>
              GPS coordinates are accessed strictly with explicit user consent to anchor garbage reports to physical coordinates. We do not track continuous background user movement.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Anonymous Reporting</span>
            </h3>
            <p>
              Citizens may post reports anonymously. When anonymous mode is selected, author user IDs are scrubbed from public Firestore queries and never exposed to other citizens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
