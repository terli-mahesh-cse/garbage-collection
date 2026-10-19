import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-float">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        
        <div>
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Civic Charter</span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading mt-1">
            Terms of Service & Citizen Code of Conduct
          </h1>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            By posting garbage reports or participating in community drives on the Garbage Collection platform, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Post truthful, contemporary photographs of litter in public spaces within your municipal area.</li>
            <li>Refrain from posting copyrighted, offensive, commercial, or defamatory media.</li>
            <li>Maintain respect towards sanitation workers, municipal personnel, and fellow volunteers.</li>
            <li>Adhere to all local laws, traffic safety precautions, and property access rules during cleanup drives.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
