import { useEffect, useState } from 'react';

import { type Todo } from './todo.ts';
import { loadTodos, saveTodos } from './todoStorage.ts';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (title: string) => {
    const trimmed = title.trim();

    if (!trimmed) {
      return;
    }

    setTodos((current) => [
      ...current,
      { id: crypto.randomUUID(), title: trimmed, completed: false },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, removeTodo };
}
