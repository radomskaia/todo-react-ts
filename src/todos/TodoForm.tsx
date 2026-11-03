import { useState } from 'react';

import { useTranslation } from '@/i18n/i18nContext.ts';

import styles from './TodoForm.module.css';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const { t } = useTranslation();
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
        aria-label={t('form.submit')}
        title={t('form.submit')}
        disabled={!canAdd}
      >
        <svg
          className={styles.buttonIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </form>
  );
}
