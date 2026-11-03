import { useEffect, useState } from 'react';

import { applyTheme, loadTheme, saveTheme, type Theme } from './theme.ts';

export function useTheme() {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    applyTheme(theme);

    return () => {
      applyTheme('system');
    };
  }, [theme]);

  const selectTheme = (next: Theme) => {
    setTheme(next);
    saveTheme(next);
  };

  return { theme, setTheme: selectTheme };
}
