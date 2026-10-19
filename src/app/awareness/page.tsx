"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  BookOpen, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  Award, 
  Leaf, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { SEED_ARTICLES, SEED_CHALLENGES } from "@/lib/data/seedData";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { EcoChallenge } from "@/types";

export default function AwarenessPage() {
  const { t } = useTranslation();
  const { awardPoints } = useAuth();

  const [challenges, setChallenges] = useState<EcoChallenge[]>(SEED_CHALLENGES);
  const [selectedArticle, setSelectedArticle] = useState(SEED_ARTICLES[0]);

  // Waste Sorter Mini Game
  const [sorterItem, setSorterItem] = useState("Plastic Milk Pouch");
  const [sorterResult, setSorterResult] = useState<string | null>(null);

  const testItems = [
    { name: "Vegetable Peelings", correct: "wet", hint: "Biodegradable kitchen food waste." },
    { name: "Plastic Milk Pouch", correct: "dry", hint: "Clean and rinse dry before recycling." },
    { name: "Used Baby Diaper", correct: "hazardous", hint: "Sanitary refuse requires red bin safe wrapping." },
    { name: "Old Laptop Battery", correct: "hazardous", hint: "Toxic lithium requires authorized e-waste disposal." },
    { name: "Pizza Cardboard Box (Clean)", correct: "dry", hint: "Recyclable paper packaging." },
    { name: "Tea Bags & Leaves", correct: "wet", hint: "Organic plant matter that enriches compost." },
  ];

  const handleSortChoice = (choice: "wet" | "dry" | "hazardous") => {
    const item = testItems.find((i) => i.name === sorterItem);
    if (!item) return;

    if (item.correct === choice) {
      setSorterResult(`✅ Correct! ${item.hint} (+5 Eco Karma)`);
      awardPoints(5, "Correct waste segregation quiz");
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } else {
      setSorterResult(`❌ Incorrect. ${sorterItem} belongs in the ${item.correct.toUpperCase()} bin. ${item.hint}`);
    }
  };

  const handleAdvanceChallenge = (chalId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === chalId) {
          const nextCount = Math.min(c.targetCount, c.currentCount + 1);
          const isDone = nextCount >= c.targetCount;
          if (isDone && !c.isCompleted) {
            awardPoints(c.pointsReward, `Completed challenge: ${c.title}`);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
          return {
            ...c,
            currentCount: nextCount,
            isCompleted: isDone,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="pb-6 border-b border-emerald-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Eco Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-heading">
            Waste Segregation & Green Living
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Practical guides to master the 3-bin system, eliminate single-use plastics, and complete monthly civic challenges.
          </p>
        </div>

        {/* 1. Interactive 3-Bin Segregation Guide */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white font-heading">
            The 3-Bin Color System
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Green Bin: Wet */}
            <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-md">
                  <Leaf className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-extrabold uppercase">
                  Green Bin
                </span>
              </div>
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
                Wet / Biodegradable Waste
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Decomposes naturally into nutrient-rich compost. Never mix with polythene or foil wrappers.
              </p>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/80 text-xs space-y-1">
                <strong>Includes:</strong> Kitchen peelings, food leftovers, fruit rinds, egg shells, coffee grounds, garden sweepings, faded flowers.
              </div>
            </div>

            {/* Blue Bin: Dry */}
            <div className="rounded-3xl bg-sky-50 dark:bg-sky-950/30 border-2 border-sky-500 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Trash2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-extrabold uppercase">
                  Blue Bin
                </span>
              </div>
              <h3 className="text-lg font-bold text-sky-950 dark:text-sky-200">
                Dry / Recyclable Waste
              </h3>
              <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
                Clean and rinse dry before disposal. Sent to formal recycling facilities and scrap hubs.
              </p>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/80 text-xs space-y-1">
                <strong>Includes:</strong> Plastic containers, water bottles, milk pouches (rinsed), cardboard, newspapers, metal cans, glass jars.
              </div>
            </div>

            {/* Red Bin: Hazardous */}
            <div className="rounded-3xl bg-red-50 dark:bg-red-950/30 border-2 border-red-500 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold uppercase">
                  Red Bin
                </span>
              </div>
              <h3 className="text-lg font-bold text-red-950 dark:text-red-200">
                Hazardous & Sanitary Waste
              </h3>
              <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
                Requires special protective incineration or hazardous facility disposal. Never touch without safety gloves.
              </p>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/80 text-xs space-y-1">
                <strong>Includes:</strong> Diapers, sanitary napkins, syringes, expired medicines, broken glass, batteries, paint cans, mosquito repellent bottles.
              </div>
            </div>

          </div>
        </div>

        {/* 2. Interactive Waste Sorter Quick Quiz */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 p-6 sm:p-8 shadow-float space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
              Quick Test: Which Bin Does It Belong In?
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase mr-2">Select Item:</span>
            {testItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setSorterItem(item.name);
                  setSorterResult(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sorterItem === item.name
                    ? "bg-primary text-white shadow-xs"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-surface/50 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-gray-400 uppercase font-bold block">Current Item to Sort</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">{sorterItem}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSortChoice("wet")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Green (Wet)
              </button>
              <button
                onClick={() => handleSortChoice("dry")}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Blue (Dry)
              </button>
              <button
                onClick={() => handleSortChoice("hazardous")}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Red (Hazardous)
              </button>
            </div>
          </div>

          {sorterResult && (
            <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 text-xs font-bold animate-in fade-in">
              {sorterResult}
            </div>
          )}
        </div>

        {/* 3. Monthly Eco Challenges Strip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white font-heading">
                Monthly Civic Challenges
              </h2>
              <p className="text-xs text-gray-500">
                Complete milestones, earn exclusive badges and climb the leaderboards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((c) => {
              const pct = Math.min(100, Math.round((c.currentCount / c.targetCount) * 100));
              return (
                <div
                  key={c.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 shadow-soft flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold">
                        +{c.pointsReward} Pts Reward
                      </span>
                      <span className="text-xs font-bold text-gray-400">{c.duration}</span>
                    </div>

                    <h3 className="font-bold text-base text-gray-900 dark:text-white font-heading">
                      {c.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <span>Progress: {c.currentCount} / {c.targetCount}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <button
                      onClick={() => handleAdvanceChallenge(c.id)}
                      disabled={c.isCompleted}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                        c.isCompleted
                          ? "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-default"
                          : "bg-primary hover:bg-primary-dark text-white shadow-soft"
                      }`}
                    >
                      {c.isCompleted ? "Challenge Completed! 🏆" : "+ Log Action"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Awareness Articles Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-heading">
              Featured Articles
            </h3>
            {SEED_ARTICLES.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedArticle.id === art.id
                    ? "bg-emerald-50 dark:bg-slate-800 border-primary shadow-soft"
                    : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-[10px] font-bold text-primary dark:text-emerald-400 uppercase tracking-wider">
                  {art.badge}
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">
                  {art.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {art.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-slate-700 shadow-float space-y-4">
            <div className="border-b border-gray-100 dark:border-slate-700 pb-4">
              <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                {selectedArticle.badge} • {selectedArticle.readTimeMinutes} min read
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-heading mt-1">
                {selectedArticle.title}
              </h2>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {selectedArticle.content}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
