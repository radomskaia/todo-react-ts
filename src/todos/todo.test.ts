import { describe, expect, it } from 'vitest';

import { sortTodos, type Todo } from './todo.ts';

function todo(title: string, completed = false): Todo {
  return { id: title, title, completed };
}

function titles(todos: readonly Todo[]) {
  return todos.map((item) => item.title);
}

describe('sortTodos', () => {
  const todos = [
    todo('Buy bread'),
    todo('apple', true),
    todo('Task 10'),
    todo('Task 2', true),
  ];

  it('keeps the order the todos were added in', () => {
    expect(titles(sortTodos(todos, 'date', 'en'))).toEqual([
      'Buy bread',
      'apple',
      'Task 10',
      'Task 2',
    ]);
  });

  it('sorts alphabetically, ignoring case and comparing numbers by value', () => {
    expect(titles(sortTodos(todos, 'alphabet', 'en'))).toEqual([
      'apple',
      'Buy bread',
      'Task 2',
      'Task 10',
    ]);
  });

  it('puts active todos first, keeping the added order within each group', () => {
    expect(titles(sortTodos(todos, 'activeFirst', 'en'))).toEqual([
      'Buy bread',
      'Task 10',
      'apple',
      'Task 2',
    ]);
  });

  it('does not change the original list', () => {
    const original = [...todos];

    sortTodos(todos, 'alphabet', 'en');

    expect(todos).toEqual(original);
  });
});
