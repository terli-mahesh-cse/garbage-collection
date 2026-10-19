"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

interface TreeVisualizerProps {
  points: number;
  level: string;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ points, level }) => {
  // Determine growth stage
  let stage = 1;
  let nextThreshold = 400;
  let stageName = "Sprout";

  if (points >= 2000) {
    stage = 5;
    nextThreshold = 3000;
    stageName = "Blooming Eco Forest";
  } else if (points >= 1000) {
    stage = 4;
    nextThreshold = 1800;
    stageName = "Mature Eco Tree";
  } else if (points >= 400) {
    stage = 3;
    nextThreshold = 1000;
    stageName = "Growing Sapling";
  } else if (points >= 150) {
    stage = 2;
    nextThreshold = 400;
    stageName = "Young Sprout";
  }

  const progressPercent = Math.min(100, Math.round((points / nextThreshold) * 100));

  return (
    <div className="rounded-3xl bg-surface/50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 p-6 flex flex-col items-center justify-between shadow-soft relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-2xl pointer-events-none" />

      <div className="w-full flex items-center justify-between text-xs font-bold mb-2 z-10">
        <span className="text-primary dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Community Tree</span>
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-extrabold text-[11px]">
          Stage {stage}/5 • {stageName}
        </span>
      </div>

      {/* Dynamic Animated Tree SVG */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-2 z-10">
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          {stage <= 2 ? (
            /* Sprout */
            <svg viewBox="0 0 200 200" className="w-40 h-40">
              <ellipse cx="100" cy="180" rx="60" ry="12" fill="#A5D6A7" />
              <path d="M100 180 Q 95 130 100 100" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M100 100 Q 70 80 80 60 Q 100 70 100 100" fill="#66BB6A" />
              <path d="M100 110 Q 130 90 120 70 Q 100 80 100 110" fill="#4CAF50" />
            </svg>
          ) : stage === 3 ? (
            /* Sapling */
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              <ellipse cx="100" cy="185" rx="70" ry="14" fill="#A5D6A7" />
              <path d="M100 185 L100 110 Q 90 80 75 60 M100 120 Q 115 90 125 70" stroke="#4E342E" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="75" cy="55" r="30" fill="#43A047" />
              <circle cx="125" cy="65" r="32" fill="#66BB6A" />
              <circle cx="100" cy="45" r="34" fill="#2E7D32" />
            </svg>
          ) : (
            /* Full Lush Eco Tree (matches PDF Page 8 design) */
            <svg viewBox="0 0 240 240" className="w-48 h-48 sm:w-52 sm:h-52 drop-shadow-md">
              {/* Ground Mound */}
              <ellipse cx="120" cy="215" rx="85" ry="16" fill="#A5D6A7" />
              
              {/* Robust Trunk */}
              <path
                d="M108 215 L112 140 Q 95 110 75 90 M128 215 L124 140 Q 145 110 165 90 M118 140 L118 100"
                stroke="#4E342E"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />

              {/* Lush Canopy Clusters (Foliage) */}
              <circle cx="75" cy="100" r="42" fill="#43A047" opacity="0.95" />
              <circle cx="165" cy="100" r="42" fill="#43A047" opacity="0.95" />
              <circle cx="120" cy="65" r="48" fill="#2E7D32" />
              <circle cx="120" cy="115" r="40" fill="#388E3C" />
              <circle cx="95" cy="80" r="38" fill="#66BB6A" />
              <circle cx="145" cy="80" r="38" fill="#4CAF50" />

              {/* Little fruits or flowers if high points */}
              {stage >= 4 && (
                <>
                  <circle cx="85" cy="75" r="5" fill="#FFB300" />
                  <circle cx="150" cy="70" r="5" fill="#FFB300" />
                  <circle cx="120" cy="50" r="5.5" fill="#FF7043" />
                  <circle cx="105" cy="110" r="4.5" fill="#FFB300" />
                  <circle cx="140" cy="105" r="5" fill="#FF7043" />
                </>
              )}
            </svg>
          )}
        </motion.div>
      </div>

      {/* Level & Points Progress Bar */}
      <div className="w-full space-y-2 z-10">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
          <span>Level {stage} - {level}</span>
          <span className="text-emerald-700 dark:text-emerald-300 font-mono">
            ({points.toLocaleString()} / {nextThreshold.toLocaleString()} pts)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-emerald-100 dark:bg-slate-700 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};
