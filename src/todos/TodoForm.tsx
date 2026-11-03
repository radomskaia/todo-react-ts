import { useState } from 'react';

import { t } from '@/i18n/t.ts';

import styles from './TodoForm.module.css';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const canAdd = title.trim() !== '';

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();

        if (!canAdd) {
          return;
        }

        onAdd(title);
        setTitle('');
      }}
    >
      <input
        className={styles.input}
        type="text"
        aria-label={t('form.label')}
        placeholder={t('form.placeholder')}
        autoComplete="off"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />
      <button
        className={styles.button}
        type="submit"
        disabled={!canAdd}
      >
        {t('form.submit')}
      </button>
    </form>
  );
}
