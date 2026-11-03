import { type ru } from './locales/ru.ts';

type SourceMessages = typeof ru;

export type MessageKey = keyof SourceMessages;

export type Messages = Record<MessageKey, string>;

type Placeholders<Message extends string> =
  Message extends `${string}{${infer Name}}${infer Rest}`
    ? Name | Placeholders<Rest>
    : never;

type MessageParams<Key extends MessageKey> = Record<
  Placeholders<SourceMessages[Key]>,
  string | number
>;

export type ParamsArgument<Key extends MessageKey> = [
  Placeholders<SourceMessages[Key]>,
] extends [never]
  ? []
  : [params: MessageParams<Key>];
