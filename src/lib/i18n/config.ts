import en from '../../locales/en.json';
import pt from '../../locales/pt.json';
import es from '../../locales/es.json';

export type Locale = 'en' | 'pt' | 'es';

export const defaultLocale: Locale = 'en';

export const locales: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const dictionaries = {
  en,
  pt,
  es,
};

export type Dictionary = typeof en;

// Helper to get nested key by dot notation (e.g. "nav.dashboard")
export function getNestedTranslation(dict: Dictionary, key: string): string {
  const parts = key.split('.');
  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key; // Fallback to key if not found
    }
  }
  return typeof current === 'string' ? current : key;
}
