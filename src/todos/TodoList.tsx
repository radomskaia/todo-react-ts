import {
  type KeyboardEvent,
  type Ref,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

import { type Todo } from './todo.ts';
import { TodoItem } from './TodoItem.tsx';
import styles from './TodoList.module.css';

export interface TodoListHandle {
  focusFirst: () => void;
}

interface TodoListProps {
  ref?: Ref<TodoListHandle>;
  todos: readonly Todo[];
  emptyText: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onExit: () => void;
}

export function TodoList({
  ref,
  todos,
  emptyText,
  onToggle,
  onRemove,
  onExit,
}: TodoListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const checkboxesRef = useRef(new Map<string, HTMLInputElement>());
  const pendingFocusRef = useRef<{ id: string; index: number } | null>(null);

  const focusAt = (index: number) => {
    const todo = todos[index];

    if (todo) {
      checkboxesRef.current.get(todo.id)?.focus();
    }
  };

  useImperativeHandle(ref, () => ({
    focusFirst: () => {
      focusAt(0);
    },
  }));

  useLayoutEffect(() => {
    const pending = pendingFocusRef.current;

    if (!pending) {
      return;
    }

    pendingFocusRef.current = null;

    const target =
      todos.find((todo) => todo.id === pending.id) ??
      todos[Math.min(pending.index, todos.length - 1)];

    if (target) {
      checkboxesRef.current.get(target.id)?.focus();
    } else {
      onExit();
    }
  });

  const keepFocusAround = (id: string) => {
    if (listRef.current?.contains(document.activeElement)) {
      pendingFocusRef.current = { id, index: todos.findIndex((todo) => todo.id === id) };
    }
  };

  const handleToggle = (id: string) => {
    keepFocusAround(id);
    onToggle(id);
  };

  const handleRemove = (id: string) => {
    keepFocusAround(id);
    onRemove(id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, id: string) => {
    const index = todos.findIndex((todo) => todo.id === id);

    switch (event.key) {
      case 'ArrowDown': {
        focusAt(index + 1);
        break;
      }

      case 'ArrowUp': {
        if (index === 0) {
          onExit();
        } else {
          focusAt(index - 1);
        }

        break;
      }

      case 'Home': {
        focusAt(0);
        break;
      }

      case 'End': {
        focusAt(todos.length - 1);
        break;
      }

      case 'Delete':
      case 'Backspace': {
        handleRemove(id);
        break;
      }

      default: {
        return;
      }
    }

    event.preventDefault();
  };

  if (todos.length === 0) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
    <ul
      ref={listRef}
      className={styles.list}
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          checkboxRef={(element) => {
            if (!element) {
              return;
            }

            checkboxesRef.current.set(todo.id, element);

            return () => {
              checkboxesRef.current.delete(todo.id);
            };
          }}
          onToggle={handleToggle}
          onRemove={handleRemove}
          onKeyDown={(event) => {
            handleKeyDown(event, todo.id);
          }}
        />
      ))}
    </ul>
  );
}
