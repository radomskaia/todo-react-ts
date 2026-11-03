import { createContext, use } from 'react';

import { type Locale, type Translator } from './translate.ts';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translator;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useTranslation(): I18nContextValue {
  const value = use(I18nContext);

  if (!value) {
    throw new Error('useTranslation must be used inside I18nProvider');
  }

  return value;
}
