"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "./translations";

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations.en[key] || (key as string),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang") as Language;
    if (urlLang && (urlLang === "en" || urlLang === "hi" || urlLang === "te")) {
      setLangState(urlLang);
      localStorage.setItem("gc_lang", urlLang);
    } else {
      const saved = localStorage.getItem("gc_lang") as Language;
      if (saved && (saved === "en" || saved === "hi" || saved === "te")) {
        setLangState(saved);
      }
    }

    if (params.get("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("gc_lang", newLang);
  };

  const t = (key: TranslationKey): string => {
    const currentDict = translations[lang];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    return translations.en[key] || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
