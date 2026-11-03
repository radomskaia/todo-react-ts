import { describe, expect, it } from 'vitest';

import { t } from './t.ts';

describe('t', () => {
  it('returns a message without placeholders as is', () => {
    expect(t('form.submit')).toBe('Добавить');
  });

  it('substitutes a number placeholder', () => {
    expect(t('app.remaining', { count: 3 })).toBe('Осталось задач: 3');
  });

  it('substitutes a string placeholder', () => {
    expect(t('todo.remove', { title: 'Купить молоко' })).toBe(
      'Удалить задачу «Купить молоко»',
    );
  });

  it('does not treat placeholder syntax inside a value as a placeholder', () => {
    expect(t('todo.remove', { title: '{title}' })).toBe('Удалить задачу «{title}»');
  });
});
