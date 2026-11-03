import { readStorage, writeStorage } from '@/lib/storage.ts';

import { isLocale, type Locale } from './translate.ts';

export const localeStorageKey = 'todo-react-ts:locale';

const fallbackLocale: Locale = 'en';

export function detectLocale(languages: readonly string[]): Locale {
  return (
    languages.map((language) => language.toLowerCase().split('-')[0]).find(isLocale) ??
    fallbackLocale
  );
}

export function loadLocale(): Locale {
  const saved = readStorage(localeStorageKey);

  return isLocale(saved) ? saved : detectLocale(navigator.languages);
}

export function saveLocale(locale: Locale): void {
  writeStorage(localeStorageKey, locale);
}
