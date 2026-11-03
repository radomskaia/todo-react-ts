import { Select, type SelectOption } from '@/ui/Select.tsx';

import { useTranslation } from './i18nContext.ts';
import { type Locale } from './translate.ts';

const languageOptions: readonly SelectOption<Locale>[] = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <Select
      label={t('settings.language')}
      options={languageOptions}
      value={locale}
      onChange={setLocale}
    />
  );
}
