import { readStorage, writeStorage } from '@/lib/storage.ts';

import { type Todo } from './todo.ts';

export const todosStorageKey = 'todo-react-ts:todos';

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
