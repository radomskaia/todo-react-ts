import { useState } from 'react';

import { t } from '@/i18n/t.ts';
import { filterTodos, type TodoFilter } from '@/todos/todo.ts';
import { TodoFilters } from '@/todos/TodoFilters.tsx';
import { TodoForm } from '@/todos/TodoForm.tsx';
import { TodoList } from '@/todos/TodoList.tsx';
import { useTodos } from '@/todos/useTodos.ts';

import styles from './App.module.css';

export function App() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();
  const [filter, setFilter] = useState<TodoFilter>('all');
  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className={styles.app}>
      <h1 className={styles.heading}>{t('app.title')}</h1>
      <section className={styles.card}>
        <TodoForm onAdd={addTodo} />
        <TodoFilters
          value={filter}
          onChange={setFilter}
        />
        <TodoList
          todos={filterTodos(todos, filter)}
          emptyText={t(`empty.${filter}`)}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />
        <p className={styles.footer}>{t('app.remaining', { count: activeCount })}</p>
      </section>
    </main>
  );
}
