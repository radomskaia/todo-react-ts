export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const todoFilters = ['all', 'active', 'completed'] as const;

export type TodoFilter = (typeof todoFilters)[number];

export function filterTodos(todos: readonly Todo[], filter: TodoFilter): readonly Todo[] {
  switch (filter) {
    case 'all': {
      return todos;
    }

    case 'active': {
      return todos.filter((todo) => !todo.completed);
    }

    case 'completed': {
      return todos.filter((todo) => todo.completed);
    }
  }
}
