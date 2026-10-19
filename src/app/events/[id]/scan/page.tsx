"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  AlertCircle,
  Users
} from "lucide-react";
import { mockStore } from "@/lib/data/mockStore";
import { CleanupEvent } from "@/types";

export default function EventScannerPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<CleanupEvent | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [checkInList, setCheckInList] = useState<string[]>([
    "Ravi Kumar (Verified Volunteer)",
    "Anita Sharma (Co-organizer)",
  ]);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    const ev = mockStore.getEventById(eventId);
    if (ev) setEvent(ev);
  }, [eventId]);

  const startScanner = async () => {
    try {
      setScannerActive(true);
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleSuccessfulScan(decodedText);
          html5QrCode.stop().catch(() => {});
          setScannerActive(false);
        },
        (errorMessage) => {
          // scanning frame errors can be ignored
        }
      );
    } catch (err) {
      console.warn("HTML5 QR Code scanner camera error", err);
      setScannerActive(false);
    }
  };

  const handleSuccessfulScan = (code: string) => {
    setScannedResult(code);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2E7D32", "#66BB6A", "#4FC3F7"],
    });

    const volunteerName = `Attendee #${Math.floor(1000 + Math.random() * 9000)}`;
    setCheckInList((prev) => [volunteerName, ...prev]);
    mockStore.checkInAttendee(eventId, `volunteer-${Date.now()}`);
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleSuccessfulScan(manualCode);
    setManualCode("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-float border border-emerald-100 dark:border-slate-800 space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Volunteer Check-In Terminal
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white font-heading">
              {event?.title || "Cleanup Drive Scanner"}
            </h1>
            <p className="text-xs text-gray-500">
              Scan attendee QR passes to verify attendance and award +50 points.
            </p>
          </div>

          {/* Scanner Viewport */}
          <div className="border-2 border-dashed border-emerald-300 dark:border-slate-700 rounded-3xl p-4 bg-surface/30 dark:bg-slate-800/40 text-center space-y-4">
            <div id="reader" className="w-full min-h-[260px] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {!scannerActive && (
                <div className="text-gray-400 p-6 space-y-3">
                  <QrCode className="w-16 h-16 mx-auto text-emerald-600 animate-pulse" />
                  <p className="text-xs font-semibold">Camera is ready</p>
                  <button
                    onClick={startScanner}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-soft transition-all"
                  >
                    Launch Camera Scanner
                  </button>
                </div>
              )}
            </div>

            {scannedResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 flex items-center justify-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Pass Verified: {scannedResult} (+50 pts awarded)</span>
              </div>
            )}
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualCheckIn} className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
              Manual Pass Verification
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter 4-digit code (e.g. 4821 or user ID)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                Check In
              </button>
            </div>
          </form>

          {/* Realtime Check-In List */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Verified Attendees Today</span>
              <span className="text-primary font-bold">{checkInList.length} checked in</span>
            </div>
            <div className="space-y-2">
              {checkInList.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/80 text-xs"
                >
                  <span className="font-bold text-gray-800 dark:text-gray-200">{name}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
