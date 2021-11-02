export interface Handler<T> {
  init(): Promise<void>;
  handle(interaction: T): Promise<unknown>;
}
