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
  formatCurrency: (value: number | string, includeSymbol?: boolean) => string;
  formatDate: (date: Date | string) => string;
  formatNumber: (value: number | string, decimals?: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [basis, setBasisState] = useState<'ACCRUAL' | 'CASH'>('ACCRUAL');

  useEffect(() => {
    const savedLocale = localStorage.getItem('uas_locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'pt' || savedLocale === 'es')) {
      setLocaleState(savedLocale);
      document.documentElement.lang = savedLocale;
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
      return AutoTranslator.translate(enTranslation, locale);
    }

    // If raw English text was passed directly or as fallback
    const rawText = fallback || key;
    return AutoTranslator.translate(rawText, locale);
  };

  /**
   * Dynamic locale currency formatter
   */
  const formatCurrency = (value: number | string, includeSymbol = true): string => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0 : value;
    const isNegative = num < 0;
    const absVal = Math.abs(num);

    let formatted = '';
    if (locale === 'pt' || locale === 'es') {
      // 1.234,56
      formatted = absVal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const symbol = includeSymbol ? (locale === 'pt' ? 'US$ ' : 'US$ ') : '';
      return isNegative ? `(${symbol}${formatted})` : `${symbol}${formatted}`;
    } else {
      // 1,234.56
      formatted = absVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const symbol = includeSymbol ? '$' : '';
      return isNegative ? `(${symbol}${formatted})` : `${symbol}${formatted}`;
    }
  };

  /**
   * Dynamic locale date formatter
   */
  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    if (locale === 'pt' || locale === 'es') {
      return `${day}/${month}/${year}`;
    } else {
      return `${month}/${day}/${year}`;
    }
  };

  /**
   * Dynamic locale number formatter
   */
  const formatNumber = (value: number | string, decimals = 2): string => {
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
    if (locale === 'pt' || locale === 'es') {
      return num.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    } else {
      return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        basis,
        setBasis,
        formatCurrency,
        formatDate,
        formatNumber,
      }}
    >
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
