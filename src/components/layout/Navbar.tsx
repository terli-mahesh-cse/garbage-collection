"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MapPin, 
  PlusCircle, 
  Users, 
  Calendar, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Globe, 
  Moon, 
  Sun, 
  ChevronDown, 
  Sparkles,
  Menu,
  X,
  User as UserIcon
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Language } from "@/lib/i18n/translations";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { lang, setLang, t } = useTranslation();
  const { currentCity, availableCities, selectCity } = useLocation();
  const { user, role, switchRole, logout } = useAuth();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { href: `/map/${currentCity.id}`, label: t("navMap"), icon: MapPin },
    { href: "/report", label: t("navReport"), icon: PlusCircle },
    { href: "/communities", label: t("navCommunities"), icon: Users },
    { href: "/events", label: t("navEvents"), icon: Calendar },
    { href: "/awareness", label: t("navAwareness"), icon: BookOpen },
    { href: "/impact", label: t("navImpact"), icon: Award },
    { href: "/authority", label: t("navAuthority"), icon: ShieldCheck, badge: "Officer" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-100 dark:border-emerald-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  <path d="M10 11v6m4-6v6"/>
                  <circle cx="16" cy="7" r="1" fill="#4FC3F7" stroke="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white tracking-tight">
                    Garbage Collection
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    Live PWA
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium hidden sm:block">
                  {t("tagline")}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:text-primary hover:bg-emerald-50 dark:text-gray-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 text-[10px] uppercase font-bold px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Controls: City Selector, Language, Dark Mode, Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* City Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold transition-colors"
                aria-label="Select City"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{currentCity.name}, {currentCity.stateCode}</span>
                <ChevronDown className="w-3 h-3 text-emerald-600 ml-0.5" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-float border border-emerald-100 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">
                    Select City
                  </div>
                  {availableCities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        selectCity(c.id);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                        c.id === currentCity.id
                          ? "bg-emerald-500 text-white font-semibold"
                          : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className={`text-[10px] ${c.id === currentCity.id ? "text-emerald-100" : "text-gray-400"}`}>
                        Score {c.cleanlinessScore}%
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 dark:border-slate-800 mt-1 pt-1">
                    <Link
                      href="/start"
                      onClick={() => setCityDropdownOpen(false)}
                      className="block text-center text-xs text-primary font-semibold py-1.5 hover:underline"
                    >
                      + Choose another city
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-emerald-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
                title="Change Language"
                aria-label="Language selector"
              >
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs uppercase font-bold">{lang}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900 shadow-float border border-emerald-100 dark:border-slate-800 p-1.5 z-50">
                  {[
                    { code: "en", label: "English" },
                    { code: "hi", label: "हिन्दी (Hindi)" },
                    { code: "te", label: "తెలుగు (Telugu)" },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code as Language);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        lang === item.code
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-emerald-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* User / Tester Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-soft transition-all"
                aria-label="User Account"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.slice(0, 1) || "U"}
                </div>
                <span className="hidden sm:inline font-semibold">{user?.name?.split(" ")[0]}</span>
                <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 uppercase font-bold">
                  {role}
                </span>
                <ChevronDown className="w-3 h-3 text-white/80" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-float border border-emerald-100 dark:border-slate-800 p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">{user?.points} pts • {user?.level}</p>
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">
                    Switch Test Persona:
                  </div>
                  {[
                    { r: "citizen", label: "Citizen (Ravi K.)" },
                    { r: "officer", label: "Municipal Officer (Dr. Srinivas)" },
                    { r: "admin", label: "Platform Admin (Anita S.)" },
                  ].map((p) => (
                    <button
                      key={p.r}
                      onClick={() => {
                        switchRole(p.r as UserRole);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium ${
                        role === p.r
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 dark:border-slate-800 mt-1 pt-1">
                    <Link
                      href="/start"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-primary font-medium"
                    >
                      Sign in with another phone/email
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-white/95 dark:bg-slate-900/95 border-b border-emerald-100 dark:border-slate-800 shadow-float">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-auto text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-400 text-amber-950 rounded-md">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
