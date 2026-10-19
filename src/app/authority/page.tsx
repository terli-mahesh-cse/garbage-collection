"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ChevronDown, 
  Truck, 
  Send, 
  Eye, 
  Layers,
  BarChart3,
  Settings,
  X
} from "lucide-react";
import { mockStore } from "@/lib/data/mockStore";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { Report, ReportStatus, City } from "@/types";

export default function AuthorityDashboardPage() {
  const { currentCity } = useLocation();
  const { user, role, switchRole } = useAuth();
  const { t } = useTranslation();

  const [selectedWardId, setSelectedWardId] = useState("ward-12");
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "teams" | "analytics">("overview");
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");

  // Assign / Status Modal
  const [modalReport, setModalReport] = useState<Report | null>(null);
  const [assignTeam, setAssignTeam] = useState("Kukatpally Tipper Squad #4");
  const [newStatus, setNewStatus] = useState<ReportStatus>("in_progress");
  const [resolutionNote, setResolutionNote] = useState("");

  const loadReports = () => {
    setReports(mockStore.getReports(currentCity.id));
  };

  useEffect(() => {
    loadReports();
    const unsub = mockStore.subscribe(loadReports);
    return unsub;
  }, [currentCity]);

  const wards = currentCity.wards || [
    { id: "ward-12", name: "Ward 12 - Kukatpally" },
    { id: "ward-15", name: "Ward 15 - Madhapur & Hitec City" },
  ];

  const currentWardName = wards.find((w) => w.id === selectedWardId)?.name || "Ward 12 - Kukatpally";

  // Ward filtered reports
  const wardReports = useMemo(() => {
    return reports.filter((r) => {
      if (selectedWardId !== "all" && r.wardId !== selectedWardId) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.address.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.types.some(t => t.includes(q));
      }
      return true;
    });
  }, [reports, selectedWardId, statusFilter, searchQuery]);

  const kpis = useMemo(() => {
    const list = selectedWardId === "all" ? reports : reports.filter(r => r.wardId === selectedWardId);
    return {
      open: list.filter(r => r.status === "reported").length || 128,
      inProgress: list.filter(r => r.status === "in_progress").length || 34,
      resolved: list.filter(r => r.status === "cleaned").length || 412,
      avgResponse: "1.8 days",
    };
  }, [reports, selectedWardId]);

  const handleUpdateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalReport) return;

    mockStore.updateReportStatus(
      modalReport.id,
      newStatus,
      user?.name || "Dr. K. Srinivas Rao (GHMC Zonal Officer)",
      `${resolutionNote || "Action taken by sanitation squad."} Team assigned: ${assignTeam}.`
    );

    setModalReport(null);
    setResolutionNote("");
    loadReports();
  };

  const handleExportCsv = () => {
    const headers = "ID,Address,Ward,Types,Severity,Status,Upvotes,ReportedAt\n";
    const rows = wardReports.map(r => 
      `"${r.id}","${r.address.replace(/"/g, '""')}","${r.wardName}","${r.types.join(';')}","${r.severity}","${r.status}",${r.upvotes},"${r.createdAt}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `municipal-reports-${selectedWardId}-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] flex">
      
      {/* 1. Left Sidebar Navigation (matches PDF Page 9) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-5 space-y-6 shrink-0 border-r border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-sm leading-tight">
              GHMC Sanitation
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium">Officer Terminal</span>
          </div>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "reports", label: "Reports", icon: FileText, count: reports.length },
            { id: "teams", label: "Teams & Fleets", icon: Truck },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Officer Persona Info */}
        <div className="mt-auto p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">{user?.name || "Dr. K. Srinivas"}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              OFFICER
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{currentCity.name} Zonal Health & Sanitation</p>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Top Ward Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-extrabold text-primary dark:text-emerald-400 uppercase tracking-wider">
              {currentCity.name} Municipal Corporation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-heading mt-0.5">
              {currentWardName}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Ward Selector Dropdown */}
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            >
              <option value="all">All Wards Combined</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 font-bold text-xs shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("btnExportCsv")}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards (matches PDF Page 9: 128 Open reports, 34 In progress, 412 Resolved, 1.8 days Avg response) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border-l-4 border-l-red-500 border border-emerald-100 dark:border-slate-700 shadow-soft">
            <span className="text-3xl sm:text-4xl font-extrabold text-red-600 font-heading block">
              {kpis.open}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1 block">
              {t("openReports")}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border-l-4 border-l-amber-500 border border-emerald-100 dark:border-slate-700 shadow-soft">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-heading block">
              {kpis.inProgress}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1 block">
              In progress
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border-l-4 border-l-emerald-500 border border-emerald-100 dark:border-slate-700 shadow-soft">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-emerald-400 font-heading block">
              {kpis.resolved}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1 block">
              {t("resolved")}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border-l-4 border-l-sky-500 border border-emerald-100 dark:border-slate-700 shadow-soft">
            <span className="text-3xl sm:text-4xl font-extrabold text-sky-600 font-heading block">
              {kpis.avgResponse}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1 block">
              {t("avgResponse")}
            </span>
          </div>
        </div>

        {/* Latest Reports Table (matches PDF Page 9) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-float border border-emerald-100 dark:border-slate-700 overflow-hidden space-y-4 p-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading self-start sm:self-auto">
              Latest reports in {currentWardName}
            </h3>

            {/* Table Search & Status Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter location or ID..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="reported">Reported</option>
                <option value="in_progress">In progress</option>
                <option value="cleaned">Resolved</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">LOCATION</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">VOTES</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700 font-medium text-gray-700 dark:text-gray-200">
                {wardReports.slice(0, 10).map((r) => {
                  const statusPill = 
                    r.status === "reported" 
                      ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                      : r.status === "in_progress"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";

                  return (
                    <tr key={r.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-500">
                        #{r.id.replace("rep-", "")}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        <div className="font-bold text-gray-900 dark:text-white truncate">
                          {r.address}
                        </div>
                        <span className="text-[10px] text-gray-400 block truncate">{r.wardName}</span>
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        {r.types[0]?.replace("_", " ") || "General"}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {r.upvotes}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${statusPill}`}>
                          {r.status === "cleaned" ? "Resolved" : r.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setModalReport(r);
                            setNewStatus(r.status === "reported" ? "in_progress" : "cleaned");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-primary dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-emerald-300 font-bold text-xs transition-colors shadow-2xs"
                        >
                          {r.status === "cleaned" ? "View" : "Assign"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* Modal: Assign Team & Update Status */}
      {modalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-float border border-emerald-100 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase">Municipal Dispatch</span>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                  Report #{modalReport.id}
                </h3>
              </div>
              <button
                onClick={() => setModalReport(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              {modalReport.address}
            </p>

            <form onSubmit={handleUpdateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Assign Sanitation Team / Fleet
                </label>
                <select
                  value={assignTeam}
                  onChange={(e) => setAssignTeam(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Kukatpally Tipper Squad #4">Kukatpally Tipper Squad #4</option>
                  <option value="Rapid Drain Clearance Unit #2">Rapid Drain Clearance Unit #2</option>
                  <option value="Biomedical Safety Contractor (CareEco)">Biomedical Safety Contractor (CareEco)</option>
                  <option value="Debris Removal Heavy Vehicle #8">Debris Removal Heavy Vehicle #8</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Transition Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus("in_progress")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      newStatus === "in_progress"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("cleaned")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      newStatus === "cleaned"
                        ? "bg-primary text-white shadow-xs"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    Resolved / Cleaned ✨
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Official Log / Resolution Notes
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Cleared 150 kg debris; area disinfected with lime."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-all"
              >
                Submit Action & Dispatch
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
