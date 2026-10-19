"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Clock, 
  ShieldCheck, 
  X,
  Search
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { mockStore } from "@/lib/data/mockStore";
import { CleanupEvent } from "@/types";
import { QRCodeView } from "@/components/common/QRCodeView";

export default function EventsPage() {
  const { t } = useTranslation();
  const { currentCity } = useLocation();
  const { user, awardPoints } = useAuth();

  const [events, setEvents] = useState<CleanupEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CleanupEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create event modal states
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("2026-11-22");
  const [eventTime, setEventTime] = useState("07:00 AM");
  const [eventAddress, setEventAddress] = useState("");
  const [eventCapacity, setEventCapacity] = useState(60);
  const [eventDesc, setEventDesc] = useState("");

  const loadEvents = () => {
    const list = mockStore.getEvents(currentCity.id);
    setEvents(list);
    if (!selectedEvent && list.length > 0) {
      setSelectedEvent(list[0]);
    }
  };

  useEffect(() => {
    loadEvents();
    const unsub = mockStore.subscribe(loadEvents);
    return unsub;
  }, [currentCity]);

  const handleRsvp = (eventId: string) => {
    mockStore.rsvpEvent(eventId, user?.id || "user-citizen-1");
    awardPoints(15, "RSVP'd for cleanup drive");
    loadEvents();
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEv = mockStore.addEvent({
      orgId: "org-ckg",
      orgName: "Clean Kukatpally Group",
      title: eventTitle,
      description: eventDesc || "Community cleanup drive to restore green pathways and collect recyclable waste.",
      startAt: `${eventDate}T07:00:00Z`,
      formattedDate: `${new Date(eventDate).getDate()} ${new Date(eventDate).toLocaleString('en', { month: 'short' }).toUpperCase()}`,
      formattedTime: eventTime,
      lat: currentCity.lat + 0.01,
      lng: currentCity.lng + 0.01,
      address: eventAddress || `${currentCity.name} Central Zone`,
      cityName: currentCity.name,
      capacity: eventCapacity,
      bring: ["Gloves", "Water bottle", "Cloth bag"],
      provided: ["Trash pickers", "Safety vests", "Refreshments", "Volunteer E-Certificate"],
    });

    awardPoints(40, "Created community cleanup event");
    setShowCreateModal(false);
    setSelectedEvent(newEv);
  };

  const filteredEvents = events.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return e.title.toLowerCase().includes(q) || e.address.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-emerald-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Sunday & Holiday Cleanups</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-heading">
              {t("upcomingEvents")} {currentCity.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Join neighbours and earn 50 impact points and official volunteer certificates.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-bold text-sm shadow-float transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t("btnCreateEvent")}</span>
          </button>
        </div>

        {/* 2-Column Grid (matches PDF Page 7 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Events List */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drives by name or landmark..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {filteredEvents.map((ev, idx) => {
              const isSelected = selectedEvent?.id === ev.id;
              const hasJoined = ev.attendeeIds?.includes(user?.id || "user-citizen-1");
              const dateColor = idx % 3 === 0 ? "bg-emerald-600" : idx % 3 === 1 ? "bg-amber-500" : "bg-sky-500";

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary shadow-float ring-2 ring-primary/20"
                      : "border-emerald-100 dark:border-slate-700 shadow-soft hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Big Date Badge (matches PDF Page 7) */}
                    <div className={`w-16 h-16 rounded-2xl ${dateColor} text-white flex flex-col items-center justify-center shrink-0 shadow-md`}>
                      <span className="text-xl sm:text-2xl font-extrabold font-heading leading-none">
                        {ev.formattedDate.split(" ")[0]}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">
                        {ev.formattedDate.split(" ")[1]}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-snug">
                          {ev.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRsvp(ev.id);
                          }}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            hasJoined
                              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300"
                              : "bg-primary hover:bg-primary-dark text-white shadow-xs"
                          }`}
                        >
                          {hasJoined ? "Joined ✓" : t("btnRsvp")}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Meet {ev.formattedTime} • {ev.address}</span>
                      </div>

                      {/* RSVP Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                          <span>{ev.rsvpCount} / {ev.capacity} joined</span>
                          <span>{Math.round((ev.rsvpCount / ev.capacity) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (ev.rsvpCount / ev.capacity) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-gray-400">By {ev.orgName}</span>
                        <Link
                          href={`/events/${ev.id}`}
                          className="font-bold text-primary dark:text-emerald-400 hover:underline"
                        >
                          Details & Pass →
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Right Column: Selected Event Detail & QR Check-in Pass (matches PDF Page 7 right card) */}
          <div className="lg:col-span-5 sticky top-24">
            {selectedEvent ? (
              <div className="rounded-3xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 p-6 sm:p-7 shadow-float space-y-6">
                
                <div>
                  <span className="text-[11px] font-bold text-primary dark:text-emerald-400 uppercase tracking-wider">
                    Selected Cleanup Drive
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white font-heading mt-0.5">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedEvent.address}
                  </p>
                </div>

                {/* Items to bring & items provided */}
                <div className="space-y-3 p-4 rounded-2xl bg-surface/50 dark:bg-slate-700/50 border border-emerald-100 dark:border-slate-700 text-xs">
                  <div>
                    <span className="font-extrabold text-gray-800 dark:text-gray-200 block mb-1">
                      {t("bringLabel")}:
                    </span>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedEvent.bring.join(", ")}
                    </p>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300 block mb-1">
                      {t("providedLabel")}:
                    </span>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedEvent.provided.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Attendee QR Check-in Pass Section */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/70 dark:from-slate-800 dark:to-slate-900 border border-emerald-200 dark:border-slate-700 text-center space-y-3">
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white font-heading">
                    {t("yourCheckinPass")}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                    {t("checkinNotice")}
                  </p>

                  <QRCodeView
                    value={`GC-EVENT-CHECKIN:${selectedEvent.id}:${user?.id || "user-citizen-1"}`}
                    size={160}
                    label={`Pass Code: ${selectedEvent.id.slice(-4).toUpperCase()}`}
                  />

                  <div className="pt-2 flex gap-2">
                    <Link
                      href={`/events/${selectedEvent.id}/scan`}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs text-center transition-colors"
                    >
                      Organiser Scanner View
                    </Link>
                    <Link
                      href={`/events/${selectedEvent.id}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs text-center transition-colors"
                    >
                      Event Full Page
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200">
                Select an event to view details
              </div>
            )}
          </div>

        </div>

        {/* Modal: Create Event */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-float border border-emerald-100 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                  Schedule New Cleanup Drive
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Drive Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Sunday Durgam Cheruvu Shoreline Drive"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      placeholder="e.g. 7:00 AM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Meeting Point Address
                  </label>
                  <input
                    type="text"
                    value={eventAddress}
                    onChange={(e) => setEventAddress(e.target.value)}
                    placeholder="e.g. Tank Bund Gate 2, Hussain Sagar, Hyderabad"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Volunteer Limit
                    </label>
                    <input
                      type="number"
                      value={eventCapacity}
                      onChange={(e) => setEventCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                      min={10}
                      max={500}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Instructions & Logistics
                  </label>
                  <textarea
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    placeholder="What to wear, parking, hydration details..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-all"
                >
                  Publish Cleanup Drive (+40 points)
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
