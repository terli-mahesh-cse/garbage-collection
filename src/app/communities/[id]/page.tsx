"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Users, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Share2, 
  QrCode, 
  CheckCircle2, 
  Send, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { mockStore } from "@/lib/data/mockStore";
import { Organization, OrgMessage, CleanupEvent } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { QRCodeView } from "@/components/common/QRCodeView";
import { timeAgo } from "@/lib/utils";

export default function OrganizationDetailPage() {
  const params = useParams();
  const orgId = params?.id as string;
  const { user, awardPoints } = useAuth();
  const { t } = useTranslation();

  const [org, setOrg] = useState<Organization | null>(null);
  const [messages, setMessages] = useState<OrgMessage[]>([]);
  const [events, setEvents] = useState<CleanupEvent[]>([]);
  const [otherOrgs, setOtherOrgs] = useState<Organization[]>([]);
  
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "events" | "invite">("chat");
  const [newMsgText, setNewMsgText] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const loadData = () => {
    const o = mockStore.getOrganizationById(orgId);
    if (o) {
      setOrg(o);
      setMessages(mockStore.getOrgMessages(orgId));
      setEvents(mockStore.getEvents(o.cityId).filter(e => e.orgId === orgId));
      setOtherOrgs(mockStore.getOrganizations().filter(other => other.id !== orgId));
    }
  };

  useEffect(() => {
    loadData();
    const unsub = mockStore.subscribe(loadData);
    return unsub;
  }, [orgId]);

  if (!org) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Community Not Found</h2>
        <Link href="/communities" className="mt-4 text-xs font-bold text-primary hover:underline">
          Return to Communities Directory
        </Link>
      </div>
    );
  }

  const handleToggleJoin = () => {
    const nextJoined = !isJoined;
    setIsJoined(nextJoined);
    if (nextJoined) {
      awardPoints(20, "Joined community group");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    mockStore.addOrgMessage(
      orgId, 
      newMsgText, 
      user?.name || "Ravi Kumar", 
      user?.role === "officer" ? "Officer" : "Volunteer"
    );
    setNewMsgText("");
  };

  const members = [
    { name: "Ravi K.", role: "Admin", initial: "R", color: "bg-emerald-600" },
    { name: "Anita S.", role: "Moderator", initial: "A", color: "bg-amber-500" },
    { name: "Suresh P.", role: "Volunteer", initial: "S", color: "bg-sky-500" },
    { name: "Meena R.", role: "Volunteer", initial: "M", color: "bg-rose-500" },
  ];

  const inviteUrl = typeof window !== "undefined" ? window.location.href : `https://garbagecollection.in/communities/${org.id}`;

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] pb-16">
      
      {/* Top Graphic Header Banner */}
      <div className="relative h-44 sm:h-56 bg-gradient-to-r from-emerald-700 via-primary to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 60 Q 30 20, 60 70 T 100 50 L 100 100 L 0 100 Z" fill="#ffffff" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Communities</span>
          </Link>
        </div>
      </div>

      {/* Main Profile Info Section (matches PDF Page 6) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-float border border-emerald-100 dark:border-slate-800">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-accent text-white flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-float border-4 border-white dark:border-slate-900">
                {org.logo}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
                  {org.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {org.cityName} • {org.memberCount + (isJoined ? 1 : 0)} members • Founded {org.foundedYear}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="p-3 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 transition-colors"
                title="Share & QR Code"
              >
                <QrCode className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </button>

              <button
                onClick={handleToggleJoin}
                className={`px-7 py-3 rounded-2xl font-extrabold text-sm shadow-soft transition-all ${
                  isJoined
                    ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300"
                    : "bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white"
                }`}
              >
                {isJoined ? "Joined ✓" : t("btnJoinGroup")}
              </button>
            </div>
          </div>

          {/* 4 Impact Stat Cards (1,840 kg waste cleaned, 36 events held, 248 volunteers, 94 spots cleaned) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-gray-100 dark:border-slate-800">
            {[
              { val: `${org.stats.kgCleaned} kg`, label: "waste cleaned", color: "text-emerald-600" },
              { val: `${org.stats.eventsHeld}`, label: "events held", color: "text-sky-600" },
              { val: `${org.stats.volunteers}`, label: "volunteers", color: "text-amber-600" },
              { val: `${org.stats.spotsCleaned}`, label: "spots cleaned", color: "text-purple-600" },
            ].map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-surface/40 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700 text-center">
                <span className={`text-2xl sm:text-3xl font-extrabold font-heading ${st.color} block`}>
                  {st.val}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {st.label}
                </span>
              </div>
            ))}
          </div>

          {/* Members and Roles Strip (matches PDF Page 6) */}
          <div className="py-6 border-b border-gray-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t("membersAndRoles")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {members.map((m, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700"
                >
                  <div className={`w-9 h-9 rounded-full ${m.color} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                    {m.initial}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{m.name}</h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{m.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Tabs: Group Chat & Events */}
          <div className="pt-6 space-y-6">
            <div className="flex border-b border-gray-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab("chat")}
                className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "chat"
                    ? "border-primary text-primary dark:text-emerald-400"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t("chatTab")}</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
                  {messages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "events"
                    ? "border-primary text-primary dark:text-emerald-400"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Upcoming Drives</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
                  {events.length}
                </span>
              </button>
            </div>

            {/* Tab: Realtime Chat Thread */}
            {activeTab === "chat" && (
              <div className="space-y-4">
                <div className="h-64 sm:h-80 overflow-y-auto p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 space-y-3">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-2xs max-w-lg space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {msg.userName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md font-semibold">
                            {msg.userRole || "Volunteer"}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMsgText}
                    onChange={(e) => setNewMsgText(e.target.value)}
                    placeholder={t("sendChatPlaceholder")}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-soft transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Events */}
            {activeTab === "events" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.length > 0 ? (
                  events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-5 rounded-2xl bg-surface/30 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 shadow-soft space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs">
                          {ev.formattedDate}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {ev.formattedTime}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                        {ev.address}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                          {ev.rsvpCount} / {ev.capacity} volunteers
                        </span>
                        <Link
                          href={`/events/${ev.id}`}
                          className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs"
                        >
                          RSVP & QR Pass
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 col-span-2 py-8 text-center">
                    No upcoming drives scheduled yet for this organization.
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

        {/* "Other groups near you" Section (matches PDF Page 6) */}
        <div className="mt-12 space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
            {t("otherGroups")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {otherOrgs.slice(0, 4).map((o) => (
              <div
                key={o.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                    {o.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {o.memberCount} members
                  </p>
                </div>
                <Link
                  href={`/communities/${o.id}`}
                  className="mt-4 w-full py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-primary dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-emerald-300 text-xs font-bold text-center transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Invite QR Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-float border border-emerald-100 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-heading">
              Invite Volunteers to {org.name}
            </h3>
            <p className="text-xs text-gray-500">
              Scan this QR code with a phone camera to immediately open and join this organisation.
            </p>

            <QRCodeView value={inviteUrl} size={180} label={org.inviteCode} />

            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
