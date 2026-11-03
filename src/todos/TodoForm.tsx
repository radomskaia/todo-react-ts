import { type RefObject, useEffect, useState } from 'react';

import { useTranslation } from '@/i18n/i18nContext.ts';

import styles from './TodoForm.module.css';

interface TodoFormProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onAdd: (title: string) => void;
  onArrowDown: () => void;
}

const nonTextInputTypes = new Set(['checkbox', 'radio', 'button', 'submit', 'reset']);

function isTextField(target: EventTarget | null): boolean {
  if (target instanceof HTMLInputElement) {
    return !nonTextInputTypes.has(target.type);
  }

  return (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function TodoForm({ inputRef, onAdd, onArrowDown }: TodoFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const canAdd = title.trim() !== '';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const hasModifier = event.ctrlKey || event.metaKey || event.altKey;

      if (event.defaultPrevented || hasModifier || isTextField(event.target)) {
        return;
      }

      if (event.key === '/' || event.code === 'Slash' || event.code === 'KeyN') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef]);

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
        ref={inputRef}
        className={styles.input}
        type="text"
        aria-label={t('form.label')}
        aria-keyshortcuts="/ N"
        placeholder={t('form.placeholder')}
        autoComplete="off"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) {
            return;
          }

          if (event.key === 'Escape') {
            if (title) {
              setTitle('');
            } else {
              event.currentTarget.blur();
            }
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            onArrowDown();
          }
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
