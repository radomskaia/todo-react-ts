import { useTranslation } from '@/i18n/i18nContext.ts';
import { Select } from '@/ui/Select.tsx';

import { themes } from './theme.ts';
import { useTheme } from './useTheme.ts';

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <Select
      label={t('settings.theme')}
      options={themes.map((value) => ({ value, label: t(`theme.${value}`) }))}
      value={theme}
      onChange={setTheme}
    />
  );
}
