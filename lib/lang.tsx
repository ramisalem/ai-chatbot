"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type SupportedLanguage = "en" | "ar";

type LanguageContextValue = {
  language: SupportedLanguage;
  direction: "ltr" | "rtl";
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "app:language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (stored === "en" || stored === "ar") return stored;
    // Fallback to browser language
    const nav = navigator.language?.toLowerCase() || "en";
    return nav.startsWith("ar") ? "ar" : "en";
  });

  const direction = language === "ar" ? "rtl" : "ltr";

  const applyToHtml = useCallback((lang: SupportedLanguage) => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    applyToHtml(language);
  }, [language, applyToHtml]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prevLanguage: SupportedLanguage) => {
      const next = prevLanguage === "en" ? "ar" : "en";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      return next as SupportedLanguage;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    direction,
    setLanguage,
    toggleLanguage,
  }), [language, direction, setLanguage, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

