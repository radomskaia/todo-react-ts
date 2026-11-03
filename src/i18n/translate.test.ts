import { describe, expect, it } from 'vitest';

import { type Locale, locales, translate } from './translate.ts';

const placeholderPattern = /\{\w+\}/g;

function placeholdersOf(message: string): string[] {
  return [...message.matchAll(placeholderPattern)]
    .map(([placeholder]) => placeholder)
    .toSorted();
}

describe('translate', () => {
  it('returns a message without placeholders as is', () => {
    expect(translate('ru', 'form.submit')).toBe('Добавить');
    expect(translate('en', 'form.submit')).toBe('Add');
  });

  it('substitutes a number placeholder', () => {
    expect(translate('ru', 'app.remaining', { count: 3 })).toBe('Осталось задач: 3');
  });

  it('substitutes a string placeholder', () => {
    expect(translate('en', 'todo.remove', { title: 'Buy milk' })).toBe(
      'Delete task “Buy milk”',
    );
  });

  it('does not treat placeholder syntax inside a value as a placeholder', () => {
    expect(translate('ru', 'todo.remove', { title: '{title}' })).toBe(
      'Удалить задачу «{title}»',
    );
  });

  // The types check that every locale has every key; this checks that a translation
  // keeps the same placeholders, which the types cannot see.
  it.each(Object.keys(locales) as Locale[])(
    '%s uses the same placeholders as ru',
    (locale) => {
      const placeholdersByKey = (messages: Record<string, string>) =>
        Object.fromEntries(
          Object.entries(messages).map(([key, message]) => [
            key,
            placeholdersOf(message),
          ]),
        );

      expect(placeholdersByKey(locales[locale])).toEqual(placeholdersByKey(locales.ru));
    },
  );
});
