"use client";

import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  ThumbsUp, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  Navigation, 
  MessageSquare, 
  Clock, 
  ShieldCheck,
  Send,
  Sparkles
} from "lucide-react";
import { Report, UserRole } from "@/types";
import { timeAgo, formatDate } from "@/lib/utils";
import { mockStore } from "@/lib/data/mockStore";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/lib/i18n";

interface PinDetailDrawerProps {
  report: Report | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const PinDetailDrawer: React.FC<PinDetailDrawerProps> = ({
  report,
  onClose,
  onUpdate,
}) => {
  const { user, role, awardPoints } = useAuth();
  const { t } = useTranslation();

  const [commentText, setCommentText] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [officerNote, setOfficerNote] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (!report) return null;

  const handleUpvote = () => {
    mockStore.toggleUpvote(report.id, user?.id || "guest-user");
    awardPoints(2, "Upvoted report");
    onUpdate();
  };

  const handleStillDirty = () => {
    mockStore.markStillDirty(report.id);
    onUpdate();
  };

  const handleVolunteerClean = () => {
    mockStore.volunteerToClean(report.id, user?.id || "user-citizen-1");
    awardPoints(25, "Volunteered to clean spot");
    onUpdate();
  };

  const handleOfficerResolve = (newStatus: Report['status']) => {
    mockStore.updateReportStatus(
      report.id, 
      newStatus, 
      user?.name || "Dr. K. Srinivas Rao (GHMC)",
      officerNote || `Verified and transitioned to ${newStatus} by ward sanitation squad.`
    );
    setShowStatusModal(false);
    onUpdate();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const statusColors = {
    reported: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300",
    in_progress: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300",
    cleaned: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300",
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white dark:bg-slate-900 shadow-float border-l border-emerald-100 dark:border-slate-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase border ${statusColors[report.status]}`}>
            {report.status === "reported" ? t("statusReported") : report.status === "in_progress" ? t("statusInProgress") : t("statusCleaned")}
          </span>
          <span className="text-xs text-gray-400 font-mono font-medium">#{report.id}</span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-5 flex-1">
        
        {/* Photo preview container */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-inner flex items-center justify-center">
          {report.mediaUrls && report.mediaUrls.length > 0 ? (
            <div className="w-full h-full relative group">
              {/* Graphic illustration fallback if media is local mock */}
              <div className="w-full h-full bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-800 flex flex-col items-center justify-center p-4 text-center text-white">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-sm">
                  {report.status === "cleaned" ? (
                    <CheckCircle2 className="w-9 h-9 text-emerald-300 animate-sparkle" />
                  ) : (
                    <AlertTriangle className="w-9 h-9 text-amber-300" />
                  )}
                </div>
                <span className="text-sm font-bold tracking-tight">
                  {report.types.map(t => t.toUpperCase()).join(" • ")}
                </span>
                <span className="text-[11px] text-emerald-200 mt-0.5">
                  Severity: {report.severity.toUpperCase()} HEAP
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">No media attached</div>
          )}

          {report.status === "cleaned" && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500/90 text-white font-extrabold text-xs shadow-md flex items-center gap-1 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cleaned Spot</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {report.types.map((type) => (
            <span
              key={type}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase border border-emerald-100 dark:border-slate-700"
            >
              {type.replace("_", " ")}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-lg bg-sand dark:bg-slate-800 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase border border-amber-200 dark:border-slate-700">
            {report.severity} heap
          </span>
        </div>

        {/* Address and Ward */}
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                {report.address}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {report.wardName || "Ward 12 - Kukatpally"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {report.description}
        </div>

        {/* Timestamps & Reporter info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>Reported {timeAgo(report.createdAt)}</span>
          </div>
          <div>
            By: {report.anonymous ? "Anonymous Citizen" : report.userName || "Verified Citizen"}
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Upvote */}
          <button
            onClick={handleUpvote}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-primary dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-emerald-300 font-bold text-xs transition-colors border border-emerald-200 dark:border-slate-700"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{report.upvotes} {t("upvotes")}</span>
          </button>

          {/* Still Dirty */}
          <button
            onClick={handleStillDirty}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-300 font-bold text-xs transition-colors border border-red-200 dark:border-red-900"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{t("btnStillDirty")} ({report.stillDirtyCount})</span>
          </button>

          {/* Directions */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${report.lat},${report.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>{t("btnGetDirections")}</span>
          </a>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedShare ? "Copied Link!" : t("btnShare")}</span>
          </button>
        </div>

        {/* Primary Clean Action */}
        {report.status !== "cleaned" && (
          <button
            onClick={handleVolunteerClean}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-extrabold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("btnIWillClean")} (+25 points)</span>
          </button>
        )}

        {/* Municipal Officer Controls (Role: Officer or Admin) */}
        {(role === "officer" || role === "admin") && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Municipal Officer Action Panel</span>
            </div>

            <textarea
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              placeholder="Add official resolution notes (e.g. Tipper truck deployed)..."
              className="w-full text-xs p-2.5 rounded-xl border border-amber-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              rows={2}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleOfficerResolve("in_progress")}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleOfficerResolve("cleaned")}
                className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs transition-colors"
              >
                Mark Cleaned ✨
              </button>
            </div>
          </div>
        )}

        {/* Verification & Resolution Timeline */}
        {report.updates && report.updates.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Resolution Audit Timeline
            </h4>
            <div className="space-y-2.5">
              {report.updates.map((upd) => (
                <div
                  key={upd.id}
                  className="p-3 rounded-xl bg-emerald-50/70 dark:bg-slate-800/70 border border-emerald-100 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300">
                    <span>{upd.updaterName || "Authority Officer"}</span>
                    <span className="text-[10px] text-gray-500">{timeAgo(upd.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{upd.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
