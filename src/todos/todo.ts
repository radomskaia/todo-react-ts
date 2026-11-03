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

export const todoSorts = ['date', 'alphabet', 'activeFirst'] as const;

export type TodoSort = (typeof todoSorts)[number];

export function sortTodos(
  todos: readonly Todo[],
  sort: TodoSort,
  locale: string,
): readonly Todo[] {
  switch (sort) {
    case 'date': {
      return todos;
    }

    case 'alphabet': {
      const collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });

      return todos.toSorted((a, b) => collator.compare(a.title, b.title));
    }

    case 'activeFirst': {
      return todos.toSorted((a, b) => Number(a.completed) - Number(b.completed));
    }
  }
}
