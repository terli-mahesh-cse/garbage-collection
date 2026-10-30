"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";

export interface SlideItem {
  id: number;
  image: string;
  badge: string;
  title: string;
  location: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: 1,
    image: "/slides/slide-1.jpg",
    badge: "Community Drive",
    title: "Citizen Volunteer River & Park Cleanup",
    location: "Kukatpally Lakefront & Parks"
  },
  {
    id: 2,
    image: "/slides/slide-2.jpg",
    badge: "Eco Action",
    title: "Neighbourhood Sapling Plantation & Soil Restoration",
    location: "Banjara Hills Green Belt"
  },
  {
    id: 3,
    image: "/slides/slide-3.jpg",
    badge: "Spotless Cities",
    title: "Zero Waste Streets & Pristine Public Walkways",
    location: "Jubilee Hills Central"
  },
  {
    id: 4,
    image: "/slides/slide-4.jpg",
    badge: "Clean Future",
    title: "Sustainable Smart City & Modern Segregation",
    location: "HITEC City Corridor"
  }
];

interface BackgroundSlideshowProps {
  intervalMs?: number;
  className?: string;
  overlayOpacity?: string;
}

export const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({
  intervalMs = 6000,
  className = "",
  overlayOpacity = "opacity-75"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, intervalMs, nextSlide]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      {/* Slides images with smooth fade & Ken Burns subtle motion */}
      {DEFAULT_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <div
              className={`relative w-full h-full transition-transform duration-[7000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover object-center filter saturate-[1.15]"
                sizes="100vw"
              />
            </div>
          </div>
        );
      })}

      {/* Cinematic Dark Vignette & Dual Gradient Overlays for High Photo Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#03130C]/94 via-[#051F14]/84 to-[#092B1C]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03130C] via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Interactive Controls & Slide Badge (Thumb-friendly & Interactive) */}
      <div className="absolute bottom-4 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20 pointer-events-auto">
        {/* Active Slide Info Pill */}
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 shadow-lg text-xs">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-sparkle" />
            {DEFAULT_SLIDES[currentIndex].badge}:
          </span>
          <span className="text-gray-200 max-w-xs truncate">
            {DEFAULT_SLIDES[currentIndex].title}
          </span>
        </div>

        {/* Navigation & Progress Dots */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-lg ml-auto">
          {/* Prev */}
          <button
            onClick={prevSlide}
            aria-label="Previous background photo"
            className="p-1 rounded-full hover:bg-white/15 text-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5 px-1">
            {DEFAULT_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? "w-5 h-2 bg-accent shadow-xs"
                    : "w-2 h-2 bg-white/30 hover:bg-emerald-400"
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={nextSlide}
            aria-label="Next background photo"
            className="p-1 rounded-full hover:bg-white/15 text-gray-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause background slideshow" : "Play background slideshow"}
            className="p-1 ml-1 rounded-full hover:bg-white/15 text-gray-300 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
