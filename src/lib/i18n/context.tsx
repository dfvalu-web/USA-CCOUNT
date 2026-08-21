'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, defaultLocale, dictionaries, getNestedTranslation } from './config';
import { AutoTranslator } from './auto-translator';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  basis: 'ACCRUAL' | 'CASH';
  setBasis: (basis: 'ACCRUAL' | 'CASH') => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [basis, setBasisState] = useState<'ACCRUAL' | 'CASH'>('ACCRUAL');

  useEffect(() => {
    const savedLocale = localStorage.getItem('uas_locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'pt' || savedLocale === 'es')) {
      setLocaleState(savedLocale);
    }
    const savedBasis = localStorage.getItem('uas_basis') as 'ACCRUAL' | 'CASH';
    if (savedBasis && (savedBasis === 'ACCRUAL' || savedBasis === 'CASH')) {
      setBasisState(savedBasis);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('uas_locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const setBasis = (newBasis: 'ACCRUAL' | 'CASH') => {
    setBasisState(newBasis);
    localStorage.setItem('uas_basis', newBasis);
  };

  /**
   * Translates key with automatic runtime translation fallback for PT and ES
   */
  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[locale] || dictionaries.en;
    const translation = getNestedTranslation(dict, key);

    // If key found in dictionary, return it
    if (translation !== key) {
      return translation;
    }

    // If key not found in target language, check English dictionary
    const enTranslation = getNestedTranslation(dictionaries.en, key);
    if (enTranslation !== key) {
      // Auto-translate English translation into current locale
      return AutoTranslator.translate(enTranslation, locale);
    }

    // If raw English text was passed directly or as fallback
    const rawText = fallback || key;
    return AutoTranslator.translate(rawText, locale);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, basis, setBasis }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
