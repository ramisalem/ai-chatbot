'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'ar';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'app:language';

function applyLangAndDir(language: Language) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.setAttribute('lang', language);
  html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Initialize from localStorage and apply attributes ASAP after mount
  useEffect(() => {
    try {
      const saved = (typeof window !== 'undefined'
        ? (window.localStorage.getItem(LOCAL_STORAGE_KEY) as Language | null)
        : null) ?? 'en';
      setLanguageState(saved);
      applyLangAndDir(saved);
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, next);
      }
    } catch {
      // ignore storage errors
    }
    applyLangAndDir(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev => (prev === 'ar' ? 'en' : 'ar')) as Language);
  }, [setLanguage]);

  const value = useMemo<LanguageContextValue>(() => ({ language, setLanguage, toggleLanguage }), [language, setLanguage, toggleLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}