import { type Messages } from '@/i18n/messages.ts';

export const en = {
  'app.title': 'Todo list',
  'app.remaining': 'Tasks left: {count}',

  'form.label': 'New task',
  'form.placeholder': 'What needs to be done?',
  'form.submit': 'Add',

  'filters.label': 'Filter tasks',
  'filters.all': 'All',
  'filters.active': 'Active',
  'filters.completed': 'Completed',

  'empty.all': 'No tasks yet',
  'empty.active': 'No active tasks',
  'empty.completed': 'No completed tasks',

  'sort.label': 'Sort',
  'sort.date': 'By date added',
  'sort.alphabet': 'Alphabetically',
  'sort.activeFirst': 'Active first',

  'todo.remove': 'Delete task “{title}”',

  'settings.language': 'Language',
  'settings.theme': 'Theme',

  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',
} satisfies Messages;
