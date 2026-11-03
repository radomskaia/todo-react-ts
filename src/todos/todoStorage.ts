import { readStorage, writeStorage } from '@/lib/storage.ts';

import { type Todo, type TodoSort, todoSorts } from './todo.ts';

export const todosStorageKey = 'todo-react-ts:todos';

export const todoSortStorageKey = 'todo-react-ts:sort';

interface TypeofMap {
  string: string;
  boolean: boolean;
}

function hasKeyOfType<K extends PropertyKey, T extends keyof TypeofMap>(
  value: object,
  key: K,
  type: T,
): value is Record<K, TypeofMap[T]> {
  return typeof Reflect.get(value, key) === type;
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

function isTodo(value: unknown): value is Todo {
  return (
    isObject(value) &&
    hasKeyOfType(value, 'id', 'string') &&
    hasKeyOfType(value, 'title', 'string') &&
    hasKeyOfType(value, 'completed', 'boolean')
  );
}

export function loadTodos(): Todo[] {
  const raw = readStorage(todosStorageKey);

  if (raw === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter((item) => isTodo(item)) : [];
  } catch (error) {
    console.warn('Could not parse saved todos', error);

    return [];
  }
}

export function saveTodos(todos: readonly Todo[]): void {
  writeStorage(todosStorageKey, JSON.stringify(todos));
}

function isTodoSort(value: unknown): value is TodoSort {
  return typeof value === 'string' && (todoSorts as readonly string[]).includes(value);
}

export function loadTodoSort(): TodoSort {
  const saved = readStorage(todoSortStorageKey);

  return isTodoSort(saved) ? saved : 'date';
}

export function saveTodoSort(sort: TodoSort): void {
  writeStorage(todoSortStorageKey, sort);
}
