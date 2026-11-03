import { describe, expect, it, vi } from 'vitest';

import { detectLocale, loadLocale, localeStorageKey, saveLocale } from './locale.ts';

describe('detectLocale', () => {
  it('matches a regional variant to its language', () => {
    expect(detectLocale(['ru-RU'])).toBe('ru');
  });

  it('takes the first supported language in order of preference', () => {
    expect(detectLocale(['de-DE', 'en-US', 'ru'])).toBe('en');
  });

  it('falls back to English when no language is supported', () => {
    expect(detectLocale(['de-DE', 'fr'])).toBe('en');
    expect(detectLocale([])).toBe('en');
  });
});

describe('loadLocale', () => {
  it('prefers the saved language over the browser one', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US']);
    saveLocale('ru');

    expect(loadLocale()).toBe('ru');
  });

  it('ignores an unsupported saved value', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ru-RU']);
    localStorage.setItem(localeStorageKey, 'de');

    expect(loadLocale()).toBe('ru');
  });
});
