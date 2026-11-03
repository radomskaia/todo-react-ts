import { useState } from 'react';

import { type TodoSort } from './todo.ts';
import { loadTodoSort, saveTodoSort } from './todoStorage.ts';

export function useTodoSort() {
  const [sort, setSort] = useState(loadTodoSort);

  const selectSort = (next: TodoSort) => {
    setSort(next);
    saveTodoSort(next);
  };

  return { sort, setSort: selectSort };
}
