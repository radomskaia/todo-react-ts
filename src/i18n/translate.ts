import { en } from './locales/en.ts';
import { ru } from './locales/ru.ts';
import { type MessageKey, type Messages, type ParamsArgument } from './messages.ts';

export const locales = { ru, en } satisfies Record<string, Messages>;

export type Locale = keyof typeof locales;

export type Translator = <Key extends MessageKey>(
  key: Key,
  ...params: ParamsArgument<Key>
) => string;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && Object.hasOwn(locales, value);
}

export function translate<Key extends MessageKey>(
  locale: Locale,
  key: Key,
  ...[params]: ParamsArgument<Key>
): string {
  const messages: Messages = locales[locale];
  const message = messages[key];

  if (!params) {
    return message;
  }

  const values: Record<string, string | number> = params;

  return message.replaceAll(/\{(\w+)\}/g, (placeholder, name: string) => {
    const value = values[name];

    return value === undefined ? placeholder : String(value);
  });
}

export function createTranslator(locale: Locale): Translator {
  return (key, ...params) => translate(locale, key, ...params);
}
