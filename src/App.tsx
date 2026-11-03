import { useState } from 'react';

import { useTranslation } from '@/i18n/i18nContext.ts';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher.tsx';
import { ThemeSwitcher } from '@/theme/ThemeSwitcher.tsx';
import { filterTodos, sortTodos, type TodoFilter } from '@/todos/todo.ts';
import { TodoFilters } from '@/todos/TodoFilters.tsx';
import { TodoForm } from '@/todos/TodoForm.tsx';
import { TodoList } from '@/todos/TodoList.tsx';
import { TodoSortSelect } from '@/todos/TodoSortSelect.tsx';
import { useTodos } from '@/todos/useTodos.ts';
import { useTodoSort } from '@/todos/useTodoSort.ts';

import styles from './App.module.css';

export function App() {
  const { locale, t } = useTranslation();
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();
  const [filter, setFilter] = useState<TodoFilter>('all');
  const { sort, setSort } = useTodoSort();
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos =
    filter === 'all' ? sortTodos(todos, sort, locale) : filterTodos(todos, filter);

  return (
    <main className={styles.app}>
      <div className={styles.toolbar}>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <h1 className={styles.heading}>{t('app.title')}</h1>
      <section className={styles.card}>
        <TodoForm onAdd={addTodo} />
        <TodoFilters
          value={filter}
          counts={{
            all: todos.length,
            active: activeCount,
            completed: todos.length - activeCount,
          }}
          onChange={setFilter}
        />
        {filter === 'all' && (
          <div className={styles.sort}>
            <TodoSortSelect
              value={sort}
              onChange={setSort}
            />
          </div>
        )}
        <TodoList
          todos={visibleTodos}
          emptyText={t(`empty.${filter}`)}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />
        <p className={styles.footer}>{t('app.remaining', { count: activeCount })}</p>
      </section>
    </main>
  );
}
