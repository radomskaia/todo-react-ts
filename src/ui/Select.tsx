import styles from './Select.module.css';

export interface SelectOption<Value extends string> {
  value: Value;
  label: string;
}

interface SelectProps<Value extends string> {
  label: string;
  options: readonly SelectOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
}

export function Select<Value extends string>({
  label,
  options,
  value,
  onChange,
}: SelectProps<Value>) {
  return (
    <span className={styles.wrapper}>
      <select
        className={styles.select}
        aria-label={label}
        value={value}
        onChange={(event) => {
          const selected = options.find((option) => option.value === event.target.value);

          if (selected) {
            onChange(selected.value);
          }
        }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}
