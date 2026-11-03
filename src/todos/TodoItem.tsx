import { t } from '@/i18n/t.ts';

import { type Todo } from './todo.ts';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className={todo.completed ? `${styles.item} ${styles.completed}` : styles.item}>
      <label className={styles.label}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={todo.completed}
          onChange={() => {
            onToggle(todo.id);
          }}
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
