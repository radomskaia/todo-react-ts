import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { I18nContext } from './i18nContext.ts';
import { loadLocale, saveLocale } from './locale.ts';
import { createTranslator, type Locale, translate } from './translate.ts';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState(loadLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translate(locale, 'app.title');
  }, [locale]);

  const value = useMemo(() => {
    const selectLocale = (next: Locale) => {
      setLocale(next);
      saveLocale(next);
    };

    return { locale, setLocale: selectLocale, t: createTranslator(locale) };
  }, [locale]);

  return <I18nContext value={value}>{children}</I18nContext>;
}
