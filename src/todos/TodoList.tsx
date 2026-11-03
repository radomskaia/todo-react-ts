import { type Todo } from './todo.ts';
import { TodoItem } from './TodoItem.tsx';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: readonly Todo[];
  emptyText: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TodoList({ todos, emptyText, onToggle, onRemove }: TodoListProps) {
  if (todos.length === 0) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
