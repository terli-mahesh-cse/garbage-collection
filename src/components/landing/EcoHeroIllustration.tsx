"use client";

import React from "react";
import { motion } from "framer-motion";

export const EcoHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#81D4FA]/40 via-[#B3E5FC]/20 to-[#E8F5E9]/50 border border-emerald-100 shadow-float">
      {/* Sun glow */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 right-12 w-28 h-28 rounded-full bg-amber-200/50 blur-xl pointer-events-none"
      />
      <div className="absolute top-10 right-16 w-16 h-16 rounded-full bg-amber-300 border-4 border-amber-100/60 shadow-lg" />

      {/* Drifting Clouds */}
      <motion.div
        animate={{ x: [-40, 60, -40] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-10 opacity-80"
      >
        <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
          <ellipse cx="60" cy="30" rx="45" ry="18" fill="white" />
          <circle cx="45" cy="22" r="18" fill="white" />
          <circle cx="75" cy="22" r="16" fill="white" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ x: [80, -30, 80] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-32 opacity-75"
      >
        <svg width="100" height="42" viewBox="0 0 100 42" fill="none">
          <ellipse cx="50" cy="25" rx="36" ry="15" fill="white" />
          <circle cx="38" cy="18" r="14" fill="white" />
          <circle cx="62" cy="18" r="12" fill="white" />
        </svg>
      </motion.div>

      {/* Floating leaves */}
      {[
        { x: 30, y: 70, delay: 0 },
        { x: 140, y: 120, delay: 1.5 },
        { x: 280, y: 60, delay: 0.8 },
        { x: 340, y: 140, delay: 2.2 },
      ].map((leaf, i) => (
        <motion.div
          key={i}
          animate={{
            y: [leaf.y, leaf.y - 18, leaf.y],
            x: [leaf.x, leaf.x + 12, leaf.x],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: leaf.delay,
          }}
          className="absolute pointer-events-none hidden sm:block"
        >
          <div className="w-4 h-4 rounded-tl-xl rounded-br-xl bg-accent opacity-70 transform rotate-45 shadow-sm" />
        </motion.div>
      ))}

      {/* Distant City Skyline Silhouette */}
      <svg
        className="absolute bottom-24 sm:bottom-28 left-0 right-0 w-full opacity-35"
        viewBox="0 0 1200 120"
        fill="#90A4AE"
        preserveAspectRatio="none"
      >
        <rect x="80" y="40" width="35" height="80" rx="3" />
        <rect x="130" y="20" width="45" height="100" rx="3" />
        <rect x="190" y="55" width="30" height="65" rx="3" />
        <rect x="520" y="30" width="60" height="90" rx="3" />
        <rect x="590" y="45" width="40" height="75" rx="3" />
        <rect x="640" y="15" width="50" height="105" rx="3" />
        <rect x="700" y="50" width="35" height="70" rx="3" />
        <rect x="980" y="35" width="45" height="85" rx="3" />
        <rect x="1040" y="25" width="55" height="95" rx="3" />
      </svg>

      {/* Rolling Hills Layers */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1200 240"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Back Hill */}
        <path
          d="M0 160 C300 100 600 210 1200 130 L1200 240 L0 240 Z"
          fill="#A5D6A7"
        />
        {/* Middle Hill */}
        <path
          d="M0 190 C400 130 800 150 1200 180 L1200 240 L0 240 Z"
          fill="#66BB6A"
        />
        {/* Foreground Hill */}
        <path
          d="M0 215 C350 185 750 200 1200 195 L1200 240 L0 240 Z"
          fill="#2E7D32"
        />
      </svg>

      {/* Trees and Volunteers Vector Scene */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 px-6 sm:px-12 flex items-end justify-between pointer-events-none">
        
        {/* Left Trees */}
        <div className="flex items-end gap-3 sm:gap-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#388E3C] shadow-md border-2 border-emerald-400/40" />
            <div className="w-2.5 h-6 sm:h-8 bg-[#5D4037] rounded-sm -mt-1" />
          </div>
          <div className="flex flex-col items-center -ml-2 sm:-ml-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#2E7D32] shadow-md border-2 border-emerald-300/40" />
            <div className="w-3 h-8 sm:h-10 bg-[#4E342E] rounded-sm -mt-1" />
          </div>
        </div>

        {/* Center Volunteers & Recycle Bins */}
        <div className="flex items-end gap-3 sm:gap-5 scale-90 sm:scale-100">
          {/* Volunteer 1 */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-[#FFCC80] border border-amber-400" />
            <div className="w-7 h-10 bg-[#FF9800] rounded-t-lg -mt-0.5 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
              VOL
            </div>
            <div className="flex gap-1 w-6">
              <div className="w-2.5 h-6 bg-[#37474F] rounded-b-sm" />
              <div className="w-2.5 h-6 bg-[#37474F] rounded-b-sm" />
            </div>
          </div>

          {/* Volunteer 2 */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-[#FFCC80] border border-amber-400" />
            <div className="w-7 h-10 bg-[#4CAF50] rounded-t-lg -mt-0.5 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
              ECO
            </div>
            <div className="flex gap-1 w-6">
              <div className="w-2.5 h-6 bg-[#263238] rounded-b-sm" />
              <div className="w-2.5 h-6 bg-[#263238] rounded-b-sm" />
            </div>
          </div>

          {/* Green & Blue Bins */}
          <div className="flex items-end gap-1.5 ml-2">
            {/* Green Wet Bin */}
            <div className="w-8 h-12 bg-primary rounded-t-md border-t-2 border-emerald-300 flex flex-col items-center justify-start pt-1.5 shadow-md">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            {/* Blue Dry Bin */}
            <div className="w-8 h-12 bg-sky rounded-t-md border-t-2 border-sky-light flex flex-col items-center justify-start pt-1.5 shadow-md">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Trees */}
        <div className="hidden sm:flex items-end gap-3 sm:gap-5">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#388E3C] shadow-md border-2 border-emerald-400/40" />
            <div className="w-3 h-8 bg-[#4E342E] rounded-sm -mt-1" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#43A047] shadow-md" />
            <div className="w-2.5 h-6 bg-[#5D4037] rounded-sm -mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
