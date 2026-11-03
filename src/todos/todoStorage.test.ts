import { describe, expect, it, vi } from 'vitest';

import { type Todo } from './todo.ts';
import { loadTodos, saveTodos, todosStorageKey } from './todoStorage.ts';

const todo: Todo = { id: '1', title: 'Задача', completed: false };

/** Keeps expected storage warnings out of the test output. */
function silenceWarnings() {
  return vi.spyOn(console, 'warn').mockImplementation(() => undefined);
}

describe('todoStorage', () => {
  it('returns an empty list when nothing is saved', () => {
    expect(loadTodos()).toEqual([]);
  });

  it('reads back what was saved', () => {
    saveTodos([todo]);

    expect(loadTodos()).toEqual([todo]);
  });

  it('returns an empty list when the saved value is not valid JSON', () => {
    silenceWarnings();
    localStorage.setItem(todosStorageKey, '{not json');

    expect(loadTodos()).toEqual([]);
  });

  it('returns an empty list when the saved value is not a list', () => {
    localStorage.setItem(todosStorageKey, JSON.stringify({ todos: [todo] }));

    expect(loadTodos()).toEqual([]);
  });

  it('drops saved entries that are not valid todos', () => {
    localStorage.setItem(
      todosStorageKey,
      JSON.stringify([todo, null, 'text', { id: '2', title: 'Без статуса' }]),
    );

    expect(loadTodos()).toEqual([todo]);
  });

  it('keeps working when storage cannot be read', () => {
    silenceWarnings();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(loadTodos()).toEqual([]);
  });

  it('does not throw when storage is full', () => {
    const warn = silenceWarnings();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => {
      saveTodos([todo]);
    }).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });
});
