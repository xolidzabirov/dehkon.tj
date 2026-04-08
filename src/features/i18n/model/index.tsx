'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ru, { type Translations } from './locales/ru';
import en from './locales/en';
import tj from './locales/tj';

export type Locale = 'ru' | 'en' | 'tj';

const locales: Record<Locale, Translations> = { ru, en, tj };

const STORAGE_KEY = 'dehqon_lang';

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'tj',
  t: tj,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [localeState, setLocaleState] = useState<Locale>('tj');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && locales[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  return (
    <I18nContext.Provider value={{ 
      locale: localeState, 
      t: locales[localeState], 
      setLocale 
      }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export type { Translations };
