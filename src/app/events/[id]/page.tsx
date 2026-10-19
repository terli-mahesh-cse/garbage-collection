"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  QrCode, 
  Camera, 
  ArrowLeft,
  Navigation,
  ShieldCheck,
  Award
} from "lucide-react";
import { mockStore } from "@/lib/data/mockStore";
import { CleanupEvent } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { QRCodeView } from "@/components/common/QRCodeView";
import { generateVolunteerCertificate } from "@/lib/certificate";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const { user, awardPoints } = useAuth();
  const { t } = useTranslation();

  const [event, setEvent] = useState<CleanupEvent | null>(null);
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const loadEvent = () => {
    const ev = mockStore.getEventById(eventId);
    if (ev) {
      setEvent(ev);
      const uid = user?.id || "user-citizen-1";
      setHasRsvpd(ev.attendeeIds?.includes(uid) || false);
      setIsCheckedIn(ev.checkedInUserIds?.includes(uid) || false);
    }
  };

  useEffect(() => {
    loadEvent();
    const unsub = mockStore.subscribe(loadEvent);
    return unsub;
  }, [eventId, user]);

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Event Not Found</h2>
        <Link href="/events" className="mt-4 text-xs font-bold text-primary hover:underline">
          Return to Cleanup Events
        </Link>
      </div>
    );
  }

  const handleRsvp = () => {
    mockStore.rsvpEvent(eventId, user?.id || "user-citizen-1");
    awardPoints(15, "RSVP to cleanup drive");
    loadEvent();
  };

  const handleSelfCheckIn = () => {
    mockStore.checkInAttendee(eventId, user?.id || "user-citizen-1");
    awardPoints(50, "Checked into cleanup event");
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#2E7D32", "#66BB6A", "#4FC3F7", "#FB8C00"],
    });
    setIsCheckedIn(true);
    loadEvent();
  };

  const handleDownloadCertificate = () => {
    generateVolunteerCertificate({
      volunteerName: user?.name || "Ravi Kumar",
      eventTitle: event.title,
      cityName: event.cityName,
      eventDate: event.formattedDate,
      orgName: event.orgName,
      certificateId: `${event.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation back */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Drives</span>
        </Link>

        {/* Main Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 p-6 sm:p-10 shadow-float space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                <span className="text-2xl sm:text-3xl font-extrabold font-heading leading-none">
                  {event.formattedDate.split(" ")[0]}
                </span>
                <span className="text-xs font-bold tracking-wider uppercase mt-0.5">
                  {event.formattedDate.split(" ")[1]}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-primary dark:text-emerald-400 uppercase tracking-wider">
                  Organized by {event.orgName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-heading mt-1 leading-snug">
                  {event.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{event.address}</span>
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleRsvp}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  hasRsvpd
                    ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300"
                    : "bg-primary hover:bg-primary-dark text-white shadow-soft"
                }`}
              >
                {hasRsvpd ? "RSVP Confirmed ✓" : "RSVP (+15 pts)"}
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 transition-colors"
                title="View Check-in Pass"
              >
                <QrCode className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Logistics & RSVP Counter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-surface/50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Meeting Time</span>
                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{event.formattedTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-sky-600" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Volunteer Count</span>
                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                  {event.rsvpCount} / {event.capacity} Joined
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Rewards</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  +50 Pts & E-Certificate
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              About This Drive
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* What to Bring vs Provided */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900/60 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase">
                What Volunteers Should Bring
              </h4>
              <ul className="text-xs text-amber-950 dark:text-gray-300 space-y-1 list-disc list-inside">
                {event.bring.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase">
                Provided by Organization & GHMC
              </h4>
              <ul className="text-xs text-emerald-950 dark:text-gray-300 space-y-1 list-disc list-inside">
                {event.provided.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Check-in Status & PDF Certificate Download */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-surface to-teal-50 dark:from-slate-800 dark:to-slate-800/60 border border-emerald-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className={`w-5 h-5 ${isCheckedIn ? "text-emerald-600" : "text-gray-400"}`} />
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white font-heading">
                  {isCheckedIn ? "Verified Check-in Completed!" : "Check-in at Event Venue"}
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isCheckedIn 
                  ? "Congratulations! You earned +50 points. Your official certificate is ready." 
                  : "Scan QR code at the venue or use demo check-in below to claim points."}
              </p>
            </div>

            <div className="flex gap-2">
              {!isCheckedIn ? (
                <button
                  onClick={handleSelfCheckIn}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-soft transition-all"
                >
                  Verify Check-in (+50 pts)
                </button>
              ) : (
                <button
                  onClick={handleDownloadCertificate}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-soft transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download E-Certificate (PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* Organizer Scanner Link */}
          <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-100 dark:border-slate-800">
            <span className="text-gray-500">Event Lead / Volunteer Coordinator?</span>
            <Link
              href={`/events/${event.id}/scan`}
              className="font-bold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Open Camera Scanner for Attendee QR Passes</span>
            </Link>
          </div>

        </div>

      </div>

      {/* QR Pass Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-float border border-emerald-100 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-heading">
              {t("yourCheckinPass")}
            </h3>
            <p className="text-xs text-gray-500">
              {t("checkinNotice")}
            </p>

            <QRCodeView
              value={`GC-EVENT-CHECKIN:${event.id}:${user?.id || "user-citizen-1"}`}
              size={180}
              label={event.title}
            />

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
