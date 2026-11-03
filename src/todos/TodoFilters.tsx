import { useTranslation } from '@/i18n/i18nContext.ts';

import { type TodoFilter, todoFilters } from './todo.ts';
import styles from './TodoFilters.module.css';

interface TodoFiltersProps {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

export function TodoFilters({ value, onChange }: TodoFiltersProps) {
  const { t } = useTranslation();

  return (
    <div
      className={styles.filters}
      role="group"
      aria-label={t('filters.label')}
    >
      {todoFilters.map((filter) => (
        <button
          key={filter}
          className={styles.filter}
          type="button"
          aria-pressed={filter === value}
          onClick={() => {
            onChange(filter);
          }}
        >
          {t(`filters.${filter}`)}
        </button>
      ))}
    </div>
  );
}
