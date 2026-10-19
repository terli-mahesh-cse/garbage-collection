"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// Dynamic import with ssr: false for Leaflet
const GarbageMap = dynamic(
  () => import("@/components/map/GarbageMap").then((mod) => mod.GarbageMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
          Loading live garbage map...
        </p>
      </div>
    ),
  }
);

export default function CityMapPage() {
  const params = useParams();
  const cityParam = (params?.city as string) || "hyderabad";

  return <GarbageMap initialCityId={cityParam} />;
}
