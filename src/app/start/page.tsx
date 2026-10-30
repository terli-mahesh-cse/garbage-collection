"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Country, State, City as CSCity, ICountry, IState, ICity } from "country-state-city";
import { 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  User, 
  Globe2, 
  Building2, 
  ShieldCheck,
  CheckCircle2,
  Navigation
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";

export default function StartPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setLocation, currentCity } = useLocation();
  const { user, loginWithPhone, loginWithEmail, loginWithGoogle, loginWithCustomDetails } = useAuth();

  // 1. Personal Details
  const [fullName, setFullName] = useState(user?.name || "Mahesh Terli");

  // 2. Cascading World Location States
  const [selectedCountryCode, setSelectedCountryCode] = useState("IN");
  const [selectedStateCode, setSelectedStateCode] = useState("TG");
  const [selectedCityId, setSelectedCityId] = useState("hyderabad");
  const [customPlace, setCustomPlace] = useState("");
  const [isCustomPlaceMode, setIsCustomPlaceMode] = useState(false);
  const [customState, setCustomState] = useState("");
  const [isCustomStateMode, setIsCustomStateMode] = useState(false);

  // Load all 250 countries in the world
  const allCountries = useMemo(() => Country.getAllCountries(), []);
  
  // States of chosen country
  const statesOfCountry = useMemo(() => {
    return State.getStatesOfCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  // Cities of chosen state
  const citiesOfState = useMemo(() => {
    if (!selectedStateCode || isCustomStateMode) return [];
    return CSCity.getCitiesOfState(selectedCountryCode, selectedStateCode);
  }, [selectedCountryCode, selectedStateCode, isCustomStateMode]);

  // Selected Country / State object references
  const currentCountryObj = useMemo(() => {
    return Country.getCountryByCode(selectedCountryCode);
  }, [selectedCountryCode, allCountries]);

  const currentStateObj = useMemo(() => {
    return State.getStateByCodeAndCountry(selectedStateCode, selectedCountryCode);
  }, [selectedStateCode, selectedCountryCode]);

  // Auth Tabs & Credentials
  const [authTab, setAuthTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [otpSent, setOtpSent] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState<string[]>(["4", "8", "2", "0", "0", "1"]);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState(user?.email || "mahesh@clean-city.org");
  const [password, setPassword] = useState("cityclean2026");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, timerSeconds]);

  // When Country Changes
  const handleCountryChange = (cCode: string) => {
    setSelectedCountryCode(cCode);
    setIsCustomStateMode(false);
    setIsCustomPlaceMode(false);
    setCustomState("");
    setCustomPlace("");

    const newStates = State.getStatesOfCountry(cCode);
    if (newStates.length > 0) {
      setSelectedStateCode(newStates[0].isoCode);
      const newCities = CSCity.getCitiesOfState(cCode, newStates[0].isoCode);
      if (newCities.length > 0) {
        setSelectedCityId(newCities[0].name.toLowerCase().replace(/\s+/g, "-"));
      } else {
        setSelectedCityId(newStates[0].name.toLowerCase().replace(/\s+/g, "-"));
      }
    } else {
      setSelectedStateCode("");
      const c = Country.getCountryByCode(cCode);
      setSelectedCityId(c ? c.name.toLowerCase().replace(/\s+/g, "-") : "capital");
    }
  };

  // When State Changes
  const handleStateChange = (sCode: string) => {
    if (sCode === "__custom__") {
      setIsCustomStateMode(true);
      setIsCustomPlaceMode(true);
      setSelectedStateCode("");
      return;
    }
    setIsCustomStateMode(false);
    setSelectedStateCode(sCode);
    setIsCustomPlaceMode(false);
    setCustomPlace("");

    const newCities = CSCity.getCitiesOfState(selectedCountryCode, sCode);
    if (newCities.length > 0) {
      setSelectedCityId(newCities[0].name.toLowerCase().replace(/\s+/g, "-"));
    } else {
      const s = State.getStateByCodeAndCountry(sCode, selectedCountryCode);
      setSelectedCityId(s ? s.name.toLowerCase().replace(/\s+/g, "-") : "center");
    }
  };

  // When City Changes
  const handleCityChange = (val: string) => {
    if (val === "__custom__") {
      setIsCustomPlaceMode(true);
      return;
    }
    setIsCustomPlaceMode(false);
    setSelectedCityId(val);
  };

  // Determine Effective Place Name and Coordinates
  const effectiveDetails = useMemo(() => {
    const countryName = currentCountryObj?.name || "India";
    const stateName = isCustomStateMode 
      ? (customState || "State/Region") 
      : (currentStateObj?.name || selectedStateCode || "");
    
    let cityName = "";
    let cityId = "";
    let lat = currentCountryObj ? parseFloat(currentCountryObj.latitude) : 20.5937;
    let lng = currentCountryObj ? parseFloat(currentCountryObj.longitude) : 78.9629;

    if (isCustomPlaceMode && customPlace.trim()) {
      cityName = customPlace.trim();
      cityId = customPlace.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (currentStateObj && currentStateObj.latitude && currentStateObj.longitude) {
        lat = parseFloat(currentStateObj.latitude);
        lng = parseFloat(currentStateObj.longitude);
      }
    } else {
      const foundCity = citiesOfState.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === selectedCityId || c.name.toLowerCase() === selectedCityId
      );
      if (foundCity) {
        cityName = foundCity.name;
        cityId = foundCity.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (foundCity.latitude && foundCity.longitude) {
          lat = parseFloat(foundCity.latitude);
          lng = parseFloat(foundCity.longitude);
        }
      } else if (selectedCityId) {
        cityName = selectedCityId.charAt(0).toUpperCase() + selectedCityId.slice(1).replace(/-/g, " ");
        cityId = selectedCityId;
      } else {
        cityName = stateName || countryName;
        cityId = (stateName || countryName).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      }
    }

    return {
      countryName,
      countryCode: selectedCountryCode,
      stateName,
      stateCode: selectedStateCode,
      cityName,
      cityId: cityId || "city-center",
      place: `${cityName}${stateName ? `, ${stateName}` : ""}, ${countryName}`,
      lat,
      lng
    };
  }, [
    currentCountryObj, 
    currentStateObj, 
    selectedCountryCode, 
    selectedStateCode, 
    selectedCityId, 
    isCustomPlaceMode, 
    customPlace, 
    isCustomStateMode, 
    customState, 
    citiesOfState
  ]);

  const handleSendOtp = () => {
    if (!phone) {
      setErrorMsg("Please enter a valid phone number");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    setTimerSeconds(30);
    setOtpBoxes(["4", "8", "2", "0", "0", "1"]);
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    if (value.length > 1) {
      const chars = value.slice(0, 6).split("");
      const newBoxes = [...otpBoxes];
      chars.forEach((c, i) => {
        if (i < 6) newBoxes[i] = c;
      });
      setOtpBoxes(newBoxes);
      return;
    }

    const newBoxes = [...otpBoxes];
    newBoxes[index] = value;
    setOtpBoxes(newBoxes);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpBoxes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const executeLoginAndRedirect = async (type: "phone" | "email" | "direct") => {
    if (!fullName.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    // 1. Update Global Location Context
    setLocation(
      effectiveDetails.countryCode,
      effectiveDetails.stateCode,
      effectiveDetails.cityId,
      {
        countryName: effectiveDetails.countryName,
        stateName: effectiveDetails.stateName,
        cityName: effectiveDetails.cityName,
        lat: effectiveDetails.lat,
        lng: effectiveDetails.lng,
      }
    );

    // 2. Perform Custom User Login
    if (type === "phone") {
      const fullOtp = otpBoxes.join("");
      await loginWithPhone(phone, fullOtp.length === 6 ? fullOtp : "482001", {
        name: fullName.trim(),
        countryName: effectiveDetails.countryName,
        countryCode: effectiveDetails.countryCode,
        stateName: effectiveDetails.stateName,
        stateCode: effectiveDetails.stateCode,
        cityName: effectiveDetails.cityName,
        cityId: effectiveDetails.cityId,
        place: effectiveDetails.place,
      });
    } else if (type === "email") {
      await loginWithEmail(email, password, {
        name: fullName.trim(),
        countryName: effectiveDetails.countryName,
        countryCode: effectiveDetails.countryCode,
        stateName: effectiveDetails.stateName,
        stateCode: effectiveDetails.stateCode,
        cityName: effectiveDetails.cityName,
        cityId: effectiveDetails.cityId,
        place: effectiveDetails.place,
      });
    } else {
      await loginWithCustomDetails({
        name: fullName.trim(),
        phone,
        email,
        countryName: effectiveDetails.countryName,
        countryCode: effectiveDetails.countryCode,
        stateName: effectiveDetails.stateName,
        stateCode: effectiveDetails.stateCode,
        cityName: effectiveDetails.cityName,
        cityId: effectiveDetails.cityId,
        place: effectiveDetails.place,
        role: "citizen",
      });
    }

    setIsVerifying(false);
    router.push(`/map/${effectiveDetails.cityId}`);
  };

  return (
    <div className="min-h-screen bg-sand/30 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl shadow-float overflow-hidden border border-emerald-100 dark:border-slate-800">
        
        {/* Left Visual Brand Column */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#03130C] via-primary-dark to-emerald-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-extrabold shadow-sm border border-white/20">
              <Globe2 className="w-6 h-6 text-accent" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
              Global Clean City Platform
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Clean neighbourhoods anywhere in the world. Choose any country, region, and place, then geotag garbage spots on the live map.
            </p>
          </div>

          {/* Eco Benefits Checklist */}
          <div className="space-y-3.5 my-8 text-xs sm:text-sm text-emerald-100/90 relative z-10">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Worldwide GPS geotagging & bin pins</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Custom profile with your name & place</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Community drives & volunteer certificates</span>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-emerald-200 relative z-10">
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Active Login Preview
            </p>
            <div className="text-xs text-emerald-100">
              <p>Name: <strong className="text-white">{fullName || "Your Name"}</strong></p>
              <p className="truncate">Place: <strong className="text-white">{effectiveDetails.place}</strong></p>
            </div>
          </div>
        </div>

        {/* Right Form Column: Name, Location & Login */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Personalized Login & Location Setup
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
              Welcome to Clean City
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter your own name, country, and place to personalize your profile and live map.
            </p>
          </div>

          {/* Step 1: User's Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Your Full Name <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mahesh Terli"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Step 2: Global Location Selectors */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-primary dark:text-emerald-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Your Country & Place
              </span>
              <span className="text-[11px] font-normal text-gray-500 lowercase">
                250+ countries supported
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Country (All 250 World Countries) */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  1. Country
                </label>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {allCountries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.flag ? `${c.flag} ` : ""}{c.name} ({c.isoCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* State / Region */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  2. State / Region
                </label>
                {!isCustomStateMode ? (
                  <select
                    value={selectedStateCode}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {statesOfCountry.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                    <option value="__custom__">+ Type Custom State/Region</option>
                  </select>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      placeholder="Type state/province"
                      className="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomStateMode(false)}
                      className="px-2 py-1 text-[10px] rounded-lg bg-gray-200 dark:bg-slate-700 font-bold"
                      title="Back to list"
                    >
                      List
                    </button>
                  </div>
                )}
              </div>

              {/* City / Place */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  3. City / Place / Locality
                </label>
                {!isCustomPlaceMode && citiesOfState.length > 0 ? (
                  <select
                    value={selectedCityId}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full text-xs font-bold py-2 px-2.5 rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-800 text-emerald-950 dark:text-emerald-300 focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {citiesOfState.slice(0, 80).map((c, idx) => {
                      const idVal = c.name.toLowerCase().replace(/\s+/g, "-");
                      return (
                        <option key={idx} value={idVal}>
                          {c.name}
                        </option>
                      );
                    })}
                    <option value="__custom__">+ Type Custom City/Town</option>
                  </select>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customPlace}
                      onChange={(e) => {
                        setCustomPlace(e.target.value);
                        setIsCustomPlaceMode(true);
                      }}
                      placeholder="e.g. Kukatpally, Brooklyn, Town"
                      className="w-full text-xs font-bold py-2 px-2.5 rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-800 text-emerald-950 dark:text-emerald-300 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    {citiesOfState.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsCustomPlaceMode(false)}
                        className="px-2 py-1 text-[10px] rounded-lg bg-gray-200 dark:bg-slate-700 font-bold whitespace-nowrap"
                      >
                        List
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resolved Place Confirmation Badge */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-700 text-xs flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                Active Map Location:
              </span>
              <span className="font-extrabold text-primary dark:text-accent truncate max-w-[220px]">
                {effectiveDetails.place}
              </span>
            </div>
          </div>

          {/* Auth Method Tabs */}
          <div className="space-y-4">
            <div className="flex p-1 rounded-xl bg-gray-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setAuthTab("phone")}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  authTab === "phone"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                {t("tabPhone")}
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("email")}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  authTab === "email"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                {t("tabEmail")}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Phone OTP Tab */}
            {authTab === "phone" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    {t("mobileNumber")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
                    >
                      {otpSent ? "Resend" : t("btnSendOtp")}
                    </button>
                  </div>
                </div>

                {/* 6 Individual OTP Boxes */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      {t("enterOtp")}
                    </label>
                    <span className="text-xs text-gray-500 font-medium">
                      Code ready: 482001
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {otpBoxes.map((val, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-extrabold rounded-xl border-2 border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => executeLoginAndRedirect("phone")}
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-extrabold text-sm sm:text-base shadow-float transition-all disabled:opacity-50"
                >
                  {isVerifying ? t("loading") : `Login as ${fullName || "Citizen"}`}
                </button>
              </div>
            )}

            {/* Email Tab */}
            {authTab === "email" && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  executeLoginAndRedirect("email");
                }} 
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-soft transition-all"
                >
                  {isVerifying ? t("loading") : `Login as ${fullName || "Citizen"}`}
                </button>
              </form>
            )}

            {/* 1-Click Fast Enter */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => executeLoginAndRedirect("direct")}
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 dark:border-slate-700 bg-emerald-50/80 dark:bg-slate-800 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>One-Click Continue with My Profile</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
