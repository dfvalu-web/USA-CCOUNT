import { Locale } from './config';

export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = 'USD',
  locale: Locale = 'en',
  accountingFormat: boolean = false
): string {
  if (amount === undefined || amount === null) return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0 : Number(amount) || 0;

  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    pt: 'de-DE',
    es: 'de-DE',
  };

  const formatted = new Intl.NumberFormat(localeMap[locale] || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num));

  if (num < 0) {
    return accountingFormat ? `(${formatted})` : `-${formatted}`;
  }
  return formatted;
}

export function formatPercent(value: number | undefined | null, locale: Locale = 'en'): string {
  if (value === undefined || value === null) return '0.0%';
  const num = Number(value) || 0;
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-US',
  };

  return new Intl.NumberFormat(localeMap[locale] || 'en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(num / 100);
}

export function formatDate(date: Date | string | undefined | null, locale: Locale = 'en'): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!d || isNaN(d.getTime())) return String(date || '');

  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-US',
  };

  try {
    return new Intl.DateTimeFormat(localeMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch (e) {
    return String(date || '');
  }
}
