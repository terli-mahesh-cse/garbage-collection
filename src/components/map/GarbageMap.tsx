"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  CircleMarker
} from "react-leaflet";
import L from "leaflet";
import { 
  Search, 
  Filter, 
  Layers, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  MapPin,
  Trash2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Report, GarbageType, ReportSeverity, ReportStatus, Dustbin } from "@/types";
import { mockStore } from "@/lib/data/mockStore";
import { useLocation } from "@/context/LocationContext";
import { useTranslation } from "@/lib/i18n";
import { PinDetailDrawer } from "./PinDetailDrawer";

// Custom Leaflet DivIcons using inline SVG
const createBinIcon = (status: ReportStatus, types: GarbageType[]) => {
  let bgColor = "#E53935"; // red
  let badgeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;
  let glowClass = "shadow-lg";
  let sparkleHtml = "";

  if (status === "in_progress") {
    bgColor = "#FB8C00"; // orange
    badgeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>`;
  } else if (status === "cleaned") {
    bgColor = "#2E7D32"; // green
    badgeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
    glowClass = "shadow-[0_0_15px_rgba(46,125,50,0.6)]";
    sparkleHtml = `<div class="sparkle-effect absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-300 rounded-full flex items-center justify-center text-[8px] font-bold text-amber-950 shadow-sm">✨</div>`;
  }

  const html = `
    <div class="relative bin-pin-marker group cursor-pointer" style="width: 38px; height: 46px;">
      <div class="relative w-9 h-9 rounded-full flex items-center justify-center text-white ${glowClass}" style="background-color: ${bgColor}; border: 2.5px solid white;">
        ${badgeIcon}
        ${sparkleHtml}
      </div>
      <div class="w-2.5 h-2.5 rotate-45 mx-auto -mt-1 shadow-sm" style="background-color: ${bgColor}; border-right: 1.5px solid white; border-bottom: 1.5px solid white;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-bin-pin",
    iconSize: [38, 46],
    iconAnchor: [19, 44],
    popupAnchor: [0, -42],
  });
};

const dustbinIcon = L.divIcon({
  html: `
    <div class="w-7 h-7 rounded-full bg-sky-600 border-2 border-white shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
    </div>
  `,
  className: "custom-dustbin-pin",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Map helper to center on location change
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const GarbageMap: React.FC<{ initialCityId?: string }> = ({ initialCityId }) => {
  const { currentCity } = useLocation();
  const { t } = useTranslation();

  const cityId = initialCityId || currentCity.id;
  const [reports, setReports] = useState<Report[]>([]);
  const [dustbins, setDustbins] = useState<Dustbin[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<GarbageType | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<ReportSeverity | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDustbins, setShowDustbins] = useState(false);
  const [isHeatmapView, setIsHeatmapView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Map center coordinates
  const [center, setCenter] = useState<[number, number]>([currentCity.lat, currentCity.lng]);
  const [zoom, setZoom] = useState(13);

  const loadData = () => {
    const list = mockStore.getReports(cityId);
    setReports(list);
    setDustbins(mockStore.getDustbins(cityId));
  };

  useEffect(() => {
    loadData();
    const unsub = mockStore.subscribe(loadData);
    return unsub;
  }, [cityId]);

  useEffect(() => {
    setCenter([currentCity.lat, currentCity.lng]);
  }, [currentCity]);

  // Counts for filter panel
  const counts = useMemo(() => {
    const all = reports;
    return {
      reported: all.filter((r) => r.status === "reported").length,
      in_progress: all.filter((r) => r.status === "in_progress").length,
      cleaned: all.filter((r) => r.status === "cleaned").length,
    };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && !r.types.includes(typeFilter)) return false;
      if (severityFilter !== "all" && r.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAddr = r.address.toLowerCase().includes(q);
        const matchesWard = r.wardName?.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        if (!matchesAddr && !matchesWard && !matchesDesc) return false;
      }
      return true;
    });
  }, [reports, statusFilter, typeFilter, severityFilter, searchQuery]);

  // Geolocation Near Me
  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
          setZoom(15);
        },
        (err) => {
          console.warn("Geolocation fallback", err);
          setCenter([17.4852, 78.4124]); // Kukatpally hotspot
          setZoom(15);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden bg-gray-100 dark:bg-slate-950 flex">
      
      {/* 1. Left Filter & Score Panel (Collapsible) */}
      <div 
        className={`absolute sm:relative top-0 bottom-0 left-0 z-[500] w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-emerald-100 dark:border-slate-800 shadow-float flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:-translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <h2 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">
                {t("filters")}
              </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cleanliness Score Card (matches PDF design 72/100) */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-accent text-white shadow-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
              {t("yourAreaScore")}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold font-heading">{currentCity.cleanlinessScore}</span>
              <span className="text-sm font-semibold text-emerald-100">/ 100</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${currentCity.cleanlinessScore}%` }}
              />
            </div>
          </div>

          {/* Status Radio Filters */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {t("status")}
            </label>
            <div className="space-y-1.5">
              {[
                { key: "all", label: "All Spots", count: reports.length, color: "bg-gray-400" },
                { key: "reported", label: t("statusReported"), count: counts.reported, color: "bg-red-500" },
                { key: "in_progress", label: t("statusInProgress"), count: counts.in_progress, color: "bg-amber-500" },
                { key: "cleaned", label: t("statusCleaned"), count: counts.cleaned, color: "bg-emerald-500" },
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setStatusFilter(st.key as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === st.key
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                    <span>{st.label}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    ({st.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Garbage Type Tags */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {t("garbageType")}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "plastic", label: "Plastic" },
                { id: "household", label: "Household" },
                { id: "debris", label: "Debris" },
                { id: "medical", label: "Medical" },
                { id: "e-waste", label: "E-waste" },
                { id: "drain_block", label: "Drain block" },
              ].map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setTypeFilter(tp.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === tp.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {t("severity")}
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl text-center">
              {[
                { id: "all", label: "All" },
                { id: "small", label: "Small" },
                { id: "medium", label: "Med" },
                { id: "large", label: "Heap" },
              ].map((sv) => (
                <button
                  key={sv.id}
                  onClick={() => setSeverityFilter(sv.id as any)}
                  className={`py-1 text-xs font-bold rounded-lg transition-all ${
                    severityFilter === sv.id
                      ? "bg-white dark:bg-slate-700 text-primary dark:text-emerald-300 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {sv.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Toggles: Near Me, Heatmap & Dustbins */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
            <button
              onClick={handleNearMe}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-soft transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t("btnNearMe")}</span>
            </button>

            <button
              onClick={() => setIsHeatmapView(!isHeatmapView)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors ${
                isHeatmapView
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:bg-gray-50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isHeatmapView ? t("btnMarkers") : t("btnHeatmap")}</span>
            </button>

            <label className="flex items-center gap-2 px-1 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showDustbins}
                onChange={(e) => setShowDustbins(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>{t("toggleDustbins")}</span>
            </label>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 bg-emerald-50/60 dark:bg-slate-800/60 border-t border-emerald-100 dark:border-slate-800 text-[11px] text-gray-500 dark:text-gray-400 text-center">
          Showing <strong>{filteredReports.length}</strong> of {reports.length} spots
        </div>
      </div>

      {/* Floating Toggle Button for collapsed sidebar */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-[400] p-2.5 rounded-2xl bg-white dark:bg-slate-900 text-primary dark:text-emerald-300 shadow-float border border-emerald-100 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-transform"
        >
          <Filter className="w-4 h-4" />
          <span>Filters ({filteredReports.length})</span>
        </button>
      )}

      {/* 2. Top Floating Search Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-md pointer-events-auto">
        <div className="relative shadow-float rounded-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-100 dark:border-slate-800 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. The Map Canvas */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <MapController center={center} zoom={zoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Standard Pin Markers View */}
          {!isHeatmapView && (
            <>
              {filteredReports.map((report) => (
                <Marker
                  key={report.id}
                  position={[report.lat, report.lng]}
                  icon={createBinIcon(report.status, report.types)}
                  eventHandlers={{
                    click: () => {
                      setSelectedReport(report);
                    },
                  }}
                />
              ))}

              {/* Public Dustbins & Recycling Centres */}
              {showDustbins &&
                dustbins.map((bin) => (
                  <Marker
                    key={bin.id}
                    position={[bin.lat, bin.lng]}
                    icon={dustbinIcon}
                    eventHandlers={{
                      click: () => {
                        // show quick tooltip
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1">
                        <strong className="block text-sky-800">Public Bin / Recycling Point</strong>
                        <span>{bin.address}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </>
          )}

          {/* Heatmap View (Density-weighted circle markers) */}
          {isHeatmapView && (
            <>
              {filteredReports.map((report) => {
                const color = report.status === "reported" ? "#E53935" : report.status === "in_progress" ? "#FB8C00" : "#2E7D32";
                const radius = report.severity === "large" ? 28 : report.severity === "medium" ? 20 : 14;
                return (
                  <CircleMarker
                    key={`heat-${report.id}`}
                    center={[report.lat, report.lng]}
                    radius={radius}
                    pathOptions={{
                      color: "transparent",
                      fillColor: color,
                      fillOpacity: 0.5,
                    }}
                    eventHandlers={{
                      click: () => setSelectedReport(report),
                    }}
                  />
                );
              })}
            </>
          )}
        </MapContainer>
      </div>

      {/* 4. Pin Detail Drawer */}
      {selectedReport && (
        <PinDetailDrawer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={() => {
            loadData();
            // refresh selected report state
            const updated = mockStore.getReportById(selectedReport.id);
            if (updated) setSelectedReport(updated);
          }}
        />
      )}

    </div>
  );
};
