import { type KeyboardEvent, type RefCallback } from 'react';

import { useTranslation } from '@/i18n/i18nContext.ts';

import { type Todo } from './todo.ts';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  checkboxRef: RefCallback<HTMLInputElement>;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function TodoItem({
  todo,
  checkboxRef,
  onToggle,
  onRemove,
  onKeyDown,
}: TodoItemProps) {
  const { t } = useTranslation();

  return (
    <li className={todo.completed ? `${styles.item} ${styles.completed}` : styles.item}>
      <label className={styles.label}>
        <input
          ref={checkboxRef}
          className={styles.checkbox}
          type="checkbox"
          aria-keyshortcuts="Delete"
          checked={todo.completed}
          onChange={() => {
            onToggle(todo.id);
          }}
          onKeyDown={onKeyDown}
        />
        <span className={styles.title}>{todo.title}</span>
      </label>
      <button
        className={styles.remove}
        type="button"
        aria-label={t('todo.remove', { title: todo.title })}
        onClick={() => {
          onRemove(todo.id);
        }}
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  );
}
