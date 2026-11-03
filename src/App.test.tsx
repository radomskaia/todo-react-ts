import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { todosStorageKey } from '@/todos/todoStorage.ts';

import { App } from './App.tsx';

function renderApp() {
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  return { user, unmount };
}

function getInput() {
  return screen.getByRole('textbox', { name: 'Новая задача' });
}

function getAddButton() {
  return screen.getByRole('button', { name: 'Добавить' });
}

async function addTodo(user: ReturnType<typeof userEvent.setup>, title: string) {
  await user.type(getInput(), title);
  await user.click(getAddButton());
}

function getTodoTitles() {
  return screen
    .queryAllByRole('checkbox')
    .map((checkbox) => checkbox.closest('label')?.textContent);
}

describe('App', () => {
  it('shows an empty state when there are no todos', () => {
    renderApp();

    expect(screen.getByText('Задач пока нет')).toBeInTheDocument();
    expect(screen.getByText('Осталось задач: 0')).toBeInTheDocument();
  });

  describe('adding', () => {
    it('adds a todo with the button and clears the input', async () => {
      const { user } = renderApp();

      await addTodo(user, 'Купить молоко');

      expect(screen.getByRole('checkbox', { name: 'Купить молоко' })).not.toBeChecked();
      expect(getInput()).toHaveValue('');
      expect(screen.getByText('Осталось задач: 1')).toBeInTheDocument();
    });

    it('adds a todo with Enter', async () => {
      const { user } = renderApp();

      await user.type(getInput(), 'Позвонить маме{Enter}');

      expect(
        screen.getByRole('checkbox', { name: 'Позвонить маме' }),
      ).toBeInTheDocument();
    });

    it('trims surrounding whitespace from the title', async () => {
      const { user } = renderApp();

      await addTodo(user, '   Полить цветы   ');

      expect(getTodoTitles()).toEqual(['Полить цветы']);
    });

    it('keeps todos in the order they were added', async () => {
      const { user } = renderApp();

      await addTodo(user, 'Первая');
      await addTodo(user, 'Вторая');

      expect(getTodoTitles()).toEqual(['Первая', 'Вторая']);
    });

    it('does not add an empty todo', async () => {
      const { user } = renderApp();

      expect(getAddButton()).toBeDisabled();

      await user.type(getInput(), '{Enter}');

      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('does not add a todo made only of spaces', async () => {
      const { user } = renderApp();

      await user.type(getInput(), '     ');

      expect(getAddButton()).toBeDisabled();

      await user.type(getInput(), '{Enter}');

      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
      expect(screen.getByText('Задач пока нет')).toBeInTheDocument();
    });
  });

  it('toggles a todo between completed and active', async () => {
    const { user } = renderApp();

    await addTodo(user, 'Сделать зарядку');
    const checkbox = screen.getByRole('checkbox', { name: 'Сделать зарядку' });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText('Осталось задач: 0')).toBeInTheDocument();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(screen.getByText('Осталось задач: 1')).toBeInTheDocument();
  });

  it('removes a todo', async () => {
    const { user } = renderApp();

    await addTodo(user, 'Оставить');
    await addTodo(user, 'Удалить');

    await user.click(screen.getByRole('button', { name: 'Удалить задачу «Удалить»' }));

    expect(getTodoTitles()).toEqual(['Оставить']);
  });

  it('filters todos by status', async () => {
    const { user } = renderApp();

    await addTodo(user, 'Активная');
    await addTodo(user, 'Выполненная');
    await user.click(screen.getByRole('checkbox', { name: 'Выполненная' }));

    const allFilter = screen.getByRole('button', { name: 'Все' });
    const activeFilter = screen.getByRole('button', { name: 'Активные' });
    const completedFilter = screen.getByRole('button', { name: 'Выполненные' });

    expect(allFilter).toHaveAttribute('aria-pressed', 'true');

    await user.click(activeFilter);

    expect(activeFilter).toHaveAttribute('aria-pressed', 'true');
    expect(allFilter).toHaveAttribute('aria-pressed', 'false');
    expect(getTodoTitles()).toEqual(['Активная']);

    await user.click(completedFilter);

    expect(getTodoTitles()).toEqual(['Выполненная']);

    await user.click(allFilter);

    expect(getTodoTitles()).toEqual(['Активная', 'Выполненная']);
  });

  it('removes a todo from the filtered list once it no longer matches', async () => {
    const { user } = renderApp();

    await addTodo(user, 'Задача');
    await user.click(screen.getByRole('button', { name: 'Активные' }));
    await user.click(screen.getByRole('checkbox', { name: 'Задача' }));

    expect(screen.getByText('Активных задач нет')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Выполненные' }));

    expect(getTodoTitles()).toEqual(['Задача']);
  });

  it('shows an empty state for a filter with no matching todos', async () => {
    const { user } = renderApp();

    await addTodo(user, 'Задача');
    await user.click(screen.getByRole('button', { name: 'Выполненные' }));

    expect(screen.getByText('Выполненных задач нет')).toBeInTheDocument();
  });

  describe('persistence', () => {
    it('keeps todos and their status after a reload', async () => {
      const { user, unmount } = renderApp();

      await addTodo(user, 'Не забыть');
      await addTodo(user, 'Уже сделано');
      await user.click(screen.getByRole('checkbox', { name: 'Уже сделано' }));
      unmount();

      renderApp();

      expect(screen.getByRole('checkbox', { name: 'Не забыть' })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Уже сделано' })).toBeChecked();
    });

    it('does not bring back a removed todo after a reload', async () => {
      const { user, unmount } = renderApp();

      await addTodo(user, 'Временная');
      await user.click(
        screen.getByRole('button', { name: 'Удалить задачу «Временная»' }),
      );
      unmount();

      renderApp();

      expect(screen.getByText('Задач пока нет')).toBeInTheDocument();
    });

    it('loads todos that were saved earlier', () => {
      localStorage.setItem(
        todosStorageKey,
        JSON.stringify([{ id: '1', title: 'Из прошлого', completed: true }]),
      );

      renderApp();

      expect(screen.getByRole('checkbox', { name: 'Из прошлого' })).toBeChecked();
    });
  });
});
