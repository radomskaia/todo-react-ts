import { readStorage, writeStorage } from '@/lib/storage.ts';

export const themeStorageKey = 'todo-react-ts:theme';

export const themes = ['light', 'dark', 'system'] as const;

export type Theme = (typeof themes)[number];

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (themes as readonly string[]).includes(value);
}

export function loadTheme(): Theme {
  const saved = readStorage(themeStorageKey);

  return isTheme(saved) ? saved : 'system';
}

export function saveTheme(theme: Theme): void {
  writeStorage(themeStorageKey, theme);
}

export function applyTheme(theme: Theme): void {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
