import { useTranslation } from '@/i18n/i18nContext.ts';
import { Select } from '@/ui/Select.tsx';

import { type TodoSort, todoSorts } from './todo.ts';

interface TodoSortSelectProps {
  value: TodoSort;
  onChange: (sort: TodoSort) => void;
}

export function TodoSortSelect({ value, onChange }: TodoSortSelectProps) {
  const { t } = useTranslation();

  return (
    <Select
      label={t('sort.label')}
      options={todoSorts.map((sort) => ({ value: sort, label: t(`sort.${sort}`) }))}
      value={value}
      onChange={onChange}
    />
  );
}
