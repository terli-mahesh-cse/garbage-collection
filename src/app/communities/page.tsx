"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Plus, 
  MapPin, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Award,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { mockStore } from "@/lib/data/mockStore";
import { Organization } from "@/types";

export default function CommunitiesPage() {
  const { t } = useTranslation();
  const { currentCity, availableCities } = useLocation();
  const { user, awardPoints } = useAuth();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(currentCity.id);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New org form
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  const [newOrgLogo, setNewOrgLogo] = useState("");

  const loadOrgs = () => {
    setOrgs(mockStore.getOrganizations(selectedCityId));
  };

  useEffect(() => {
    loadOrgs();
    const unsub = mockStore.subscribe(loadOrgs);
    return unsub;
  }, [selectedCityId]);

  const filteredOrgs = orgs.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q);
  });

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const logo = newOrgLogo.trim() || newOrgName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    mockStore.addOrganization({
      name: newOrgName,
      cityId: selectedCityId,
      cityName: currentCity.name,
      description: newOrgDesc || `Community volunteers protecting streets and green spaces in ${newOrgName}.`,
      logo,
      adminId: user?.id || "user-citizen-1",
      adminName: user?.name || "Ravi Kumar",
    });

    awardPoints(50, "Created a community organization");
    setShowCreateModal(false);
    setNewOrgName("");
    setNewOrgDesc("");
    setNewOrgLogo("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-emerald-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Grassroots Action Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-heading">
              {t("communitiesTitle")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
              {t("communitiesSubtitle")}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-bold text-sm shadow-float transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t("btnCreateOrg")}</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups by name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto">
            {availableCities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCityId(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCityId === c.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Organizations Grid (matches PDF Page 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 p-6 shadow-soft hover:shadow-float transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-accent text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                    {org.logo}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-slate-700 text-primary dark:text-emerald-300 text-xs font-bold">
                    {org.memberCount} members
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                  {org.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {org.cityName} • Founded {org.foundedYear}
                </p>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mt-3 leading-relaxed">
                  {org.description}
                </p>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-4 gap-2 bg-emerald-50/50 dark:bg-slate-700/40 p-3 rounded-2xl text-center my-5 border border-emerald-100/60 dark:border-slate-700">
                  <div>
                    <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 block">{org.stats.kgCleaned}</span>
                    <span className="text-[10px] text-gray-500">kg waste</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 block">{org.stats.eventsHeld}</span>
                    <span className="text-[10px] text-gray-500">events</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 block">{org.stats.volunteers}</span>
                    <span className="text-[10px] text-gray-500">volunteers</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 block">{org.stats.spotsCleaned}</span>
                    <span className="text-[10px] text-gray-500">spots</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/communities/${org.id}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold text-center transition-colors shadow-soft"
                >
                  View Group Page
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create Organisation */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-float border border-emerald-100 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                  Create New Organisation
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Organisation Name
                  </label>
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="e.g. Clean Begumpet Squad"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Logo Initials (2 letters)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={newOrgLogo}
                    onChange={(e) => setNewOrgLogo(e.target.value)}
                    placeholder="e.g. CB"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Description & Objectives
                  </label>
                  <textarea
                    value={newOrgDesc}
                    onChange={(e) => setNewOrgDesc(e.target.value)}
                    placeholder="Focus area, weekend schedule, key wards..."
                    rows={3}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-all"
                >
                  Create & Launch (+50 points)
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
