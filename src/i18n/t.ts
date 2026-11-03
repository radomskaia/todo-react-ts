import { ru } from './locales/ru.ts';

type SourceMessages = typeof ru;

export type MessageKey = keyof SourceMessages;

type Placeholders<Message extends string> =
  Message extends `${string}{${infer Name}}${infer Rest}`
    ? Name | Placeholders<Rest>
    : never;

type MessageParams<Key extends MessageKey> = Record<
  Placeholders<SourceMessages[Key]>,
  string | number
>;

type ParamsArgument<Key extends MessageKey> = [
  Placeholders<SourceMessages[Key]>,
] extends [never]
  ? []
  : [params: MessageParams<Key>];

type Messages = Record<MessageKey, string>;

const messages: Messages = ru;

export function t<Key extends MessageKey>(
  key: Key,
  ...[params]: ParamsArgument<Key>
): string {
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
