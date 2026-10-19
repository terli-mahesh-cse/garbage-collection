"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Country, State, City as CSCity } from "country-state-city";
import { 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";

export default function StartPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setLocation, currentCity, availableCities } = useLocation();
  const { loginWithPhone, loginWithEmail, loginWithGoogle, switchRole } = useAuth();

  // Cascading Location States
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [selectedState, setSelectedState] = useState("TG");
  const [selectedCity, setSelectedCity] = useState("hyderabad");

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(selectedCountry);
  const cities = CSCity.getCitiesOfState(selectedCountry, selectedState);

  // Auth Tabs
  const [authTab, setAuthTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [otpSent, setOtpSent] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState<string[]>(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP resend countdown
  useEffect(() => {
    let interval: any = null;
    if (otpSent && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timerSeconds]);

  const handleCountryChange = (cCode: string) => {
    setSelectedCountry(cCode);
    const newStates = State.getStatesOfCountry(cCode);
    if (newStates.length > 0) {
      setSelectedState(newStates[0].isoCode);
      const newCities = CSCity.getCitiesOfState(cCode, newStates[0].isoCode);
      setSelectedCity(newCities.length > 0 ? newCities[0].name.toLowerCase() : "hyderabad");
    }
  };

  const handleStateChange = (sCode: string) => {
    setSelectedState(sCode);
    const newCities = CSCity.getCitiesOfState(selectedCountry, sCode);
    if (newCities.length > 0) {
      setSelectedCity(newCities[0].name.toLowerCase());
    }
  };

  const handleSendOtp = () => {
    if (!phone) {
      setErrorMsg("Please enter a valid phone number");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    setTimerSeconds(30);
    // Pre-fill demo OTP code "482001" for instant seamless testing
    setOtpBoxes(["4", "8", "2", "0", "0", "1"]);
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste full code
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

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpBoxes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otpBoxes.join("");
    if (fullOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    // Save location selection
    setLocation(selectedCountry, selectedState, selectedCity.toLowerCase());

    const success = await loginWithPhone(phone, fullOtp);
    setIsVerifying(false);

    if (success) {
      router.push(`/map/${selectedCity.toLowerCase()}`);
    } else {
      setErrorMsg("Verification failed. Please try again.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email");
      return;
    }
    setIsVerifying(true);
    setLocation(selectedCountry, selectedState, selectedCity.toLowerCase());
    await loginWithEmail(email, password);
    setIsVerifying(false);
    router.push(`/map/${selectedCity.toLowerCase()}`);
  };

  const handleGoogleLogin = async () => {
    setLocation(selectedCountry, selectedState, selectedCity.toLowerCase());
    await loginWithGoogle();
    router.push(`/map/${selectedCity.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-sand/30 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl shadow-float overflow-hidden border border-emerald-100 dark:border-slate-800">
        
        {/* Left Visual Brand Column */}
        <div className="md:col-span-5 bg-gradient-to-b from-primary via-primary-dark to-emerald-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold shadow-sm">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
              Keep our Earth clean
            </h2>
            <p className="text-emerald-100 text-sm">
              One report at a time. Connect with your neighborhood and local sanitation officers.
            </p>
          </div>

          {/* Eco Benefits Checklist */}
          <div className="space-y-3.5 my-8 text-xs sm:text-sm text-emerald-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Instant GPS garbage geotagging</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Direct notification to Municipal Wards</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Sunday volunteer cleanup drives & certificates</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-emerald-200">
            <p className="font-semibold text-white mb-0.5">Quick Demo Access</p>
            <span>Pre-filled test accounts: Citizen, Municipal Officer & Admin are ready.</span>
          </div>
        </div>

        {/* Right Form Column: Location Selects & Login */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
              {t("welcomeTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("welcomeSubtitle")}
            </p>
          </div>

          {/* Cascading Location Selectors */}
          <div className="p-4 rounded-2xl bg-surface/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-emerald-400 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Step 1: Choose Your City</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Country */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  {t("country")}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="IN">India (IN)</option>
                  {countries.slice(0, 25).map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  {t("state")}
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {states.length > 0 ? (
                    states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))
                  ) : (
                    <option value="TG">Telangana</option>
                  )}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  {t("city")}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-bold py-2 px-2.5 rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none text-emerald-900 dark:text-emerald-300"
                >
                  <option value="hyderabad">Hyderabad (Active Hub)</option>
                  <option value="pune">Pune</option>
                  <option value="bengaluru">Bengaluru</option>
                  {cities.filter(c => !["hyderabad", "pune", "bengaluru"].includes(c.name.toLowerCase())).slice(0, 20).map((c, idx) => (
                    <option key={idx} value={c.name.toLowerCase()}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
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

                {/* 6 Individual OTP Boxes (matches PDF Page 3 design) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                      {t("enterOtp")}
                    </label>
                    {otpSent && (
                      <span className="text-xs text-gray-500">
                        {timerSeconds > 0 ? `${t("otpResendIn")} ${timerSeconds}s` : "Code ready"}
                      </span>
                    )}
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
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-extrabold text-sm sm:text-base shadow-float transition-all disabled:opacity-50"
                >
                  {isVerifying ? t("loading") : t("btnVerify")}
                </button>
              </div>
            )}

            {/* Email Tab */}
            {authTab === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com (or officer@hyderabad.gov.in)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Password / Access Key
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
                  {t("btnVerify")}
                </button>
              </form>
            )}

            {/* Social Google Login Button */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-gray-400 font-semibold">
                  {t("orGoogle")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
