import { Locale } from './config';

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: Locale = 'en',
  accountingFormat: boolean = false
): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-US',
  };

  const formatted = new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (amount < 0) {
    return accountingFormat ? `(${formatted})` : `-${formatted}`;
  }
  return formatted;
}

export function formatPercent(value: number, locale: Locale = 'en'): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-US',
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatDate(date: Date | string, locale: Locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-US',
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}
