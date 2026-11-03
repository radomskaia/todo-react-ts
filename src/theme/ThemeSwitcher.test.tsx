import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { I18nProvider } from '@/i18n/I18nProvider.tsx';
import { localeStorageKey } from '@/i18n/locale.ts';

import { themeStorageKey } from './theme.ts';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';

function renderSwitcher() {
  const user = userEvent.setup();
  const { unmount } = render(
    <I18nProvider>
      <ThemeSwitcher />
    </I18nProvider>,
  );

  return { user, unmount };
}

function getSelect() {
  return screen.getByRole('combobox', { name: 'Тема' });
}

function getThemeAttribute() {
  return document.documentElement.getAttribute('data-theme');
}

beforeEach(() => {
  localStorage.setItem(localeStorageKey, 'ru');
});

describe('ThemeSwitcher', () => {
  it('follows the system theme by default', () => {
    renderSwitcher();

    expect(getSelect()).toHaveValue('system');
    expect(getThemeAttribute()).toBeNull();
  });

  it('switches to the dark and light themes', async () => {
    const { user } = renderSwitcher();

    await user.selectOptions(getSelect(), 'Тёмная');

    expect(getSelect()).toHaveValue('dark');
    expect(getThemeAttribute()).toBe('dark');

    await user.selectOptions(getSelect(), 'Светлая');

    expect(getThemeAttribute()).toBe('light');
  });

  it('goes back to the system theme', async () => {
    const { user } = renderSwitcher();

    await user.selectOptions(getSelect(), 'Тёмная');
    await user.selectOptions(getSelect(), 'Системная');

    expect(getThemeAttribute()).toBeNull();
    expect(localStorage.getItem(themeStorageKey)).toBe('system');
  });

  it('keeps the chosen theme after a reload', async () => {
    const { user, unmount } = renderSwitcher();

    await user.selectOptions(getSelect(), 'Тёмная');
    unmount();

    renderSwitcher();

    expect(getSelect()).toHaveValue('dark');
    expect(getThemeAttribute()).toBe('dark');
  });

  it('ignores an unknown saved theme', () => {
    localStorage.setItem(themeStorageKey, 'sepia');

    renderSwitcher();

    expect(getSelect()).toHaveValue('system');
    expect(getThemeAttribute()).toBeNull();
  });
});
