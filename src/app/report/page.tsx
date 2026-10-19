"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";
import { 
  Camera, 
  Video, 
  Upload, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  EyeOff, 
  RotateCcw,
  ShieldAlert,
  Loader2,
  Trash2
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { mockStore } from "@/lib/data/mockStore";
import { apiService } from "@/lib/services/api";
import { GarbageType, ReportSeverity } from "@/types";
import { reverseGeocode } from "@/lib/utils";
import { validateImageExif } from "@/lib/exif";

// Dynamic import with ssr: false for Leaflet mini-picker
const DraggableLocationPicker = dynamic(
  () => import("@/components/report/DraggableLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-44 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xs text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading map picker...
      </div>
    ),
  }
);

export default function ReportPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentCity } = useLocation();
  const { user, awardPoints } = useAuth();

  // Form states
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Privacy blur tool state
  const [isBlurToolActive, setIsBlurToolActive] = useState(false);
  const [blurCount, setBlurCount] = useState(0);

  // Location coordinates (default Kukatpally hotspot in Hyderabad)
  const [lat, setLat] = useState(17.4852);
  const [lng, setLng] = useState(78.4124);
  const [address, setAddress] = useState("Near Metro Pillar 42, Kukatpally, Hyderabad");
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Form fields
  const [selectedTypes, setSelectedTypes] = useState<GarbageType[]>(["plastic"]);
  const [severity, setSeverity] = useState<ReportSeverity>("large");
  const [description, setDescription] = useState("Plastic bags and beverage bottles dumped near the sidewalk.");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto-detect browser GPS on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const uLat = Number(pos.coords.latitude.toFixed(4));
          const uLng = Number(pos.coords.longitude.toFixed(4));
          setLat(uLat);
          setLng(uLng);
          setIsGeocoding(true);
          const addr = await reverseGeocode(uLat, uLng);
          setAddress(addr);
          setIsGeocoding(false);
        },
        (err) => {
          console.warn("GPS permission fallback to city center:", err);
        }
      );
    }
  }, []);

  // When pin moves, reverse geocode
  const handleLocationChange = async (newLat: number, newLng: number) => {
    setLat(Number(newLat.toFixed(4)));
    setLng(Number(newLng.toFixed(4)));
    setIsGeocoding(true);
    const addr = await reverseGeocode(newLat, newLng);
    setAddress(addr);
    setIsGeocoding(false);
  };

  // Toggle garbage types
  const toggleType = (tType: GarbageType) => {
    if (selectedTypes.includes(tType)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== tType));
      }
    } else {
      setSelectedTypes([...selectedTypes, tType]);
    }
  };

  // Camera start / snapshot
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.warn("Camera access fallback", e);
      // Fallback: trigger file input
      document.getElementById("photo-upload-input")?.click();
      setCameraActive(false);
    }
  };

  const captureCameraSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setMediaPreview(dataUrl);
        setMediaType("image");
      }
      // Stop video tracks
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  // EXIF and validation warnings
  const [exifWarnings, setExifWarnings] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // File Upload handling with EXIF verification
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("video/")) {
      setMediaType("video");
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setExifWarnings([]);
    } else {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Validate EXIF timestamp and GPS location
      const exifResult = await validateImageExif(file, lat, lng);
      setExifWarnings(exifResult.warnings);
    }
  };

  // Privacy blur click on image
  const handleCanvasBlurClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isBlurToolActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Apply pixelated blur square over area
    ctx.fillStyle = "rgba(40, 40, 40, 0.9)";
    ctx.fillRect(x - 25, y - 25, 50, 50);
    setBlurCount((prev) => prev + 1);
  };

  // Draw image on canvas when preview changes
  useEffect(() => {
    if (mediaPreview && mediaType === "image" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = mediaPreview;
      img.onload = () => {
        canvas.width = img.width || 600;
        canvas.height = img.height || 400;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [mediaPreview, mediaType]);

  // Submit report via unified apiService with Zod validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationError(null);

    try {
      await apiService.createReport({
        lat,
        lng,
        address,
        cityId: currentCity.id,
        cityName: currentCity.name,
        wardId: currentCity.wards[0]?.id || "ward-12",
        wardName: currentCity.wards[0]?.name || "Ward 12 - Kukatpally",
        types: selectedTypes,
        severity,
        description,
        anonymous: isAnonymous,
        mediaUrls: mediaPreview ? [mediaPreview] : ["/images/reports/plastic_pillar42.jpg"],
        mediaType,
      });

      awardPoints(10, "Posted garbage report");

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2E7D32", "#66BB6A", "#4FC3F7", "#FB8C00"],
      });

      setSubmitSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        router.push(`/map/${currentCity.id}`);
      }, 1800);
    } catch (err: any) {
      setIsSubmitting(false);
      setValidationError(err?.errors?.[0]?.message || err?.message || "Validation failed. Please check inputs.");
    }
  };

  const hasMedical = selectedTypes.includes("medical");

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-float border border-emerald-100 dark:border-slate-800 p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-extrabold text-primary dark:text-emerald-400 tracking-wider">
              Citizen Clean Action
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-heading mt-0.5">
              {t("reportTitle")}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-slate-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Earn +10 Points</span>
          </div>
        </div>

        {/* Success Modal Overlay */}
        {submitSuccess && (
          <div className="p-6 my-6 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border-2 border-emerald-500 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-2 animate-bounce" />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
              Report Successfully Posted! (+10 pts)
            </h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
              Your garbage pin is now live on the {currentCity.name} map. Redirecting to map view...
            </p>
          </div>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-4 my-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs text-red-800 dark:text-red-300 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* EXIF Timestamp & Proximity Warning Banner */}
        {exifWarnings.length > 0 && (
          <div className="p-4 my-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Photo Metadata Advisory</span>
            </div>
            {exifWarnings.map((w, idx) => (
              <p key={idx} className="text-amber-800 dark:text-amber-300 pl-6">{w}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Media & Draggable Map Picker */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Camera / Upload Box */}
            <div className="border-2 border-dashed border-emerald-200 dark:border-slate-700 rounded-3xl p-5 bg-surface/30 dark:bg-slate-800/40 text-center relative overflow-hidden">
              
              {/* Live camera stream view */}
              {cameraActive ? (
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={captureCameraSnapshot}
                    className="absolute bottom-4 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-float flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              ) : mediaPreview ? (
                /* Captured / Uploaded Preview */
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden max-h-56 bg-black flex items-center justify-center border border-gray-200 dark:border-slate-700">
                    {mediaType === "video" ? (
                      <video src={mediaPreview} controls className="max-h-56 w-auto" />
                    ) : (
                      <canvas
                        ref={canvasRef}
                        onClick={handleCanvasBlurClick}
                        className={`max-h-56 max-w-full cursor-${isBlurToolActive ? "crosshair" : "default"}`}
                      />
                    )}
                  </div>

                  {/* Privacy Blur Tool Control */}
                  {mediaType === "image" && (
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setIsBlurToolActive(!isBlurToolActive)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                          isBlurToolActive
                            ? "bg-amber-500 text-white"
                            : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{isBlurToolActive ? "Tap faces to blur" : "Blur faces/plates"}</span>
                        {blurCount > 0 && <span className="text-[10px]">({blurCount})</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPreview(null);
                          setBlurCount(0);
                        }}
                        className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Default Buttons */
                <div className="space-y-4 py-4">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-soft transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{t("takePhoto")}</span>
                    </button>

                    <label
                      htmlFor="photo-upload-input"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm shadow-xs cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Upload File</span>
                    </label>

                    <input
                      id="photo-upload-input"
                      type="file"
                      accept="image/*,video/mp4"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {t("dragDropText")}
                  </p>
                </div>
              )}
            </div>

            {/* Draggable Mini Map GPS Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{t("gpsDetected")}</span>
                </span>
                <span className="text-gray-400 font-mono text-[11px]">
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
              </div>

              <DraggableLocationPicker
                lat={lat}
                lng={lng}
                onChange={handleLocationChange}
              />
            </div>

            {/* Medical / Hazardous Waste Warning */}
            {hasMedical && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t("medicalWarning")}
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Form Details */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Address Input (Auto-filled + Editable) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  {t("addressAuto")}
                </label>
                {isGeocoding && (
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Detecting address...
                  </span>
                )}
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter street, landmark, or area..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            {/* Garbage Types Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                {t("garbageType")}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "plastic", label: t("typePlastic") },
                  { id: "household", label: t("typeHousehold") },
                  { id: "debris", label: t("typeDebris") },
                  { id: "medical", label: t("typeMedical") },
                  { id: "e-waste", label: t("typeEwaste") },
                  { id: "dead_animal", label: t("typeDeadAnimal") },
                  { id: "drain_block", label: t("typeDrainBlock") },
                ].map((item) => {
                  const isChecked = selectedTypes.includes(item.id as GarbageType);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleType(item.id as GarbageType)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isChecked
                          ? item.id === "medical"
                            ? "bg-red-600 text-white shadow-xs"
                            : "bg-primary text-white shadow-xs"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity / Size */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                Size of Garbage
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "small", label: t("severitySmall") },
                  { id: "medium", label: t("severityMedium") },
                  { id: "large", label: t("severityLarge") },
                ].map((sz) => (
                  <button
                    type="button"
                    key={sz.id}
                    onClick={() => setSeverity(sz.id as ReportSeverity)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      severity === sz.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                {t("descriptionLabel")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Post Anonymously Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="anonymous-check"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="anonymous-check"
                className="text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                {t("postAnonymously")}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-extrabold text-sm sm:text-base shadow-float transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t("btnPostReport")}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center">
              Your report will be shown on the city map and sent to the municipality.
            </p>

          </div>

        </form>

      </div>
    </div>
  );
}
