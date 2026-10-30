"use client";

import React from "react";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Calendar, 
  TreePine, 
  Sparkles, 
  Share2, 
  Heart,
  Award,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useLocation } from "@/context/LocationContext";
import { EcoHeroIllustration } from "@/components/landing/EcoHeroIllustration";
import { BackgroundSlideshow } from "@/components/common/BackgroundSlideshow";
import { AnimatedCounter } from "@/components/common/Counters";
import { SEED_ORGANIZATIONS, SEED_EVENTS, SEED_ARTICLES } from "@/lib/data/seedData";

export default function LandingPage() {
  const { t } = useTranslation();
  const { currentCity } = useLocation();

  const previewEvents = SEED_EVENTS.slice(0, 3);
  const previewOrgs = SEED_ORGANIZATIONS.slice(0, 3);
  const previewArticles = SEED_ARTICLES.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] transition-colors">
      
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-20 sm:pb-28 overflow-hidden min-h-[580px] flex items-center">
        {/* Dynamic Background Images Slideshow */}
        <BackgroundSlideshow />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
                <span>Community-powered clean city platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                <span className="text-accent block drop-shadow-md">Spot it. Post it.</span>
                <span className="text-white">Clean it together.</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-sm">
                {t("heroSubtitle")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/report"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-bold text-base shadow-float hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Camera className="w-5 h-5" />
                  <span>{t("btnReportGarbage")}</span>
                </Link>

                <Link
                  href="/events"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-emerald-400/40 font-bold text-base shadow-soft hover:shadow-md backdrop-blur-md transition-all transform hover:-translate-y-0.5"
                >
                  <Users className="w-5 h-5 text-accent" />
                  <span>{t("btnJoinCleanup")}</span>
                </Link>
              </div>

              {/* Social Proof Avatars */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs text-emerald-200/80">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 text-white flex items-center justify-center font-bold text-xs">RK</div>
                  <div className="w-8 h-8 rounded-full bg-sky-500 border-2 border-slate-900 text-white flex items-center justify-center font-bold text-xs">AS</div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-900 text-white flex items-center justify-center font-bold text-xs">SP</div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900 text-white flex items-center justify-center font-bold text-xs">+</div>
                </div>
                <span>Joined by <strong className="text-white font-semibold">12,000+ citizens</strong> across {currentCity.name} and 58 Indian cities</span>
              </div>
            </div>

            {/* Right Column: Animated Illustration & Featured Pin Card */}
            <div className="lg:col-span-5 relative">
              <EcoHeroIllustration />

              {/* Floating Live Report Preview Card */}
              <div className="absolute -bottom-6 -left-2 sm:-left-6 right-2 sm:right-6 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-emerald-500/30 animate-float pointer-events-auto">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                        Plastic
                      </span>
                      <span className="text-[11px] text-gray-400">
                        12 upvotes • Reported today
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      Near Metro Pillar 42, Kukatpally
                    </p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-ping" />
                      Status: Open Report in {currentCity.name}
                    </p>
                  </div>
                  <Link
                    href={`/map/${currentCity.id}`}
                    className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors shrink-0 shadow-sm"
                    title="View on Map"
                  >
                    <MapPin className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Live Impact Counters Bar */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { count: 12450, suffix: " kg", label: t("heroWasteCleaned"), color: "text-emerald-400", bg: "bg-slate-900/85 backdrop-blur-xl border border-emerald-500/30 shadow-xl" },
              { count: 3280, suffix: "+", label: t("heroReportsPosted"), color: "text-sky-400", bg: "bg-slate-900/85 backdrop-blur-xl border border-sky-500/30 shadow-xl" },
              { count: 410, suffix: "+", label: t("heroCleanupEvents"), color: "text-amber-400", bg: "bg-slate-900/85 backdrop-blur-xl border border-amber-500/30 shadow-xl" },
              { count: 58, suffix: " cities", label: t("heroCitiesJoined"), color: "text-purple-400", bg: "bg-slate-900/85 backdrop-blur-xl border border-purple-500/30 shadow-xl" },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-3xl ${stat.bg} transition-all hover:scale-[1.02] text-center sm:text-left`}
              >
                <div className={`text-3xl sm:text-4xl font-extrabold ${stat.color} mb-1 tracking-tight font-heading drop-shadow-sm`}>
                  <AnimatedCounter end={stat.count} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-emerald-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold text-primary tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm sm:text-base">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: t("step1Title"),
                desc: t("step1Desc"),
                icon: Camera,
                accent: "from-emerald-500 to-green-600",
                badge: "AI-ready GPS",
              },
              {
                step: "02",
                title: t("step2Title"),
                desc: t("step2Desc"),
                icon: MapPin,
                accent: "from-amber-500 to-orange-600",
                badge: "Live Heatmap",
              },
              {
                step: "03",
                title: t("step3Title"),
                desc: t("step3Desc"),
                icon: Users,
                accent: "from-sky-500 to-blue-600",
                badge: "QR Check-in & Certs",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="relative group p-8 rounded-3xl bg-surface/40 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 shadow-soft hover:shadow-float transition-all hover:-translate-y-1.5"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.accent} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-extrabold text-emerald-200 dark:text-slate-700 font-heading">
                      {item.step}
                    </span>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3 shadow-xs">
                    {item.badge}
                  </span>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-soft transition-all"
            >
              <span>Get Started in 30 Seconds</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Live Map Preview Teaser */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-primary to-emerald-900 text-white p-8 sm:p-12 shadow-float overflow-hidden relative">
            
            {/* Background decorative circles */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-accent/20 blur-xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Real-time Bin Pins in {currentCity.name}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Explore every dirty and cleaned spot on your city map
                </h2>

                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                  Interactive colour-coded pins: <span className="font-bold text-red-300">Red (Reported)</span>, <span className="font-bold text-amber-300">Orange (In progress)</span>, and <span className="font-bold text-emerald-300">Green (Sparkling Cleaned)</span>. Filter by waste type, severity, and view cleanliness heatmap scores.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={`/map/${currentCity.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-sm shadow-md transition-all"
                  >
                    <span>Open Live Map for {currentCity.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/report"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all"
                  >
                    <span>+ Post New Spot</span>
                  </Link>
                </div>
              </div>

              {/* Teaser stats box */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="text-sm font-medium text-emerald-100">City Cleanliness Index</span>
                    <span className="text-2xl font-extrabold text-white">{currentCity.cleanlinessScore} / 100</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-100">
                    <span>Open Hotspots:</span>
                    <span className="font-bold text-red-300">{currentCity.stats.openReports} spots</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-100">
                    <span>In-Progress Cleanups:</span>
                    <span className="font-bold text-amber-300">{currentCity.stats.inProgressReports} spots</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-100">
                    <span>Cleaned & Certified:</span>
                    <span className="font-bold text-emerald-300">{currentCity.stats.cleanedReports} spots</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Upcoming Cleanup Drives Strip */}
      <section className="py-12 sm:py-20 bg-white dark:bg-slate-900 border-t border-emerald-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-widest">
                Sunday & Holiday Drives
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                Upcoming Cleanup Drives in {currentCity.name}
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              <span>View all events</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewEvents.map((ev) => (
              <div 
                key={ev.id}
                className="p-6 rounded-2xl bg-surface/30 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700 shadow-soft hover:shadow-float transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs">
                      {ev.formattedDate}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {ev.formattedTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {ev.address}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      <span>{ev.rsvpCount} / {ev.capacity} joined</span>
                      <span>{Math.round((ev.rsvpCount / ev.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(ev.rsvpCount / ev.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-gray-100 dark:border-slate-700 mt-4">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                    +50 Pts & Certificate
                  </span>
                  <Link
                    href={`/events/${ev.id}`}
                    className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    RSVP
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Top City Communities Showcase (Rich Dark Background Section) */}
      <section className="py-16 sm:py-24 bg-[#0A1F16] dark:bg-[#061710] text-white relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-accent tracking-widest">
                Local Impact Groups
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Active Organisations in {currentCity.name}
              </h2>
            </div>
            <Link
              href="/communities"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-300 hover:text-white transition-colors"
            >
              <span>Explore all communities</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewOrgs.map((org) => (
              <div 
                key={org.id}
                className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-emerald-500/25 shadow-2xl hover:border-emerald-400/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-accent text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    {org.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {org.name}
                    </h3>
                    <p className="text-xs text-emerald-200/70">
                      {org.memberCount} active volunteers
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                  {org.description}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-emerald-950/60 border border-emerald-800/40 p-2.5 rounded-xl text-center mb-4 text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-400 block">{org.stats.kgCleaned} kg</span>
                    <span className="text-gray-400 text-[10px]">Cleaned</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-400 block">{org.stats.spotsCleaned}</span>
                    <span className="text-gray-400 text-[10px]">Spots restored</span>
                  </div>
                </div>

                <Link
                  href={`/communities/${org.id}`}
                  className="w-full inline-flex items-center justify-center py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-primary dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-emerald-300 text-xs font-bold transition-colors"
                >
                  View Group Page
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Municipal & NGO Partners Strip */}
      <section className="py-12 bg-white dark:bg-slate-900 border-t border-emerald-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6">
            Partnered with Municipalities & Environmental Foundations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-heading font-extrabold text-lg sm:text-xl text-gray-700 dark:text-gray-300">
              GHMC Sanitation
            </span>
            <span className="font-heading font-extrabold text-lg sm:text-xl text-emerald-700 dark:text-emerald-400">
              Swachh Bharat Urban
            </span>
            <span className="font-heading font-extrabold text-lg sm:text-xl text-sky-700 dark:text-sky-400">
              Clean Rivers Trust
            </span>
            <span className="font-heading font-extrabold text-lg sm:text-xl text-amber-700 dark:text-amber-400">
              Telangana Green Brigade
            </span>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href={`/map/${currentCity.id}`} className="hover:text-emerald-400">Live Garbage Map</Link></li>
                <li><Link href="/report" className="hover:text-emerald-400">Report Hotspot</Link></li>
                <li><Link href="/events" className="hover:text-emerald-400">Cleanup Drives</Link></li>
                <li><Link href="/communities" className="hover:text-emerald-400">City Groups</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Engagement</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/impact" className="hover:text-emerald-400">Community Tree & Points</Link></li>
                <li><Link href="/awareness" className="hover:text-emerald-400">Waste Segregation Guide</Link></li>
                <li><Link href="/start" className="hover:text-emerald-400">Switch Location / Sign in</Link></li>
                <li><Link href="/authority" className="hover:text-emerald-400">Officer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Policies & Safety</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/safety" className="hover:text-emerald-400">Safety & Hazards Guide</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-400">Privacy & Photo Blurring</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link></li>
                <li><Link href="/about" className="hover:text-emerald-400">About Our Mission</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Garbage Collection</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Spot it. Post it. Clean it together. Dedicated to making every Indian neighbourhood spotless through citizen power and municipal collaboration.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold">
                PWA Ready • Offline Enabled
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
            <p>© 2026 Garbage Collection Platform. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Built with Next.js, Leaflet & Firebase</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
