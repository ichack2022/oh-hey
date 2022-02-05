export default interface Messager {
  poll(): boolean;

  send(): void;

  get(): string;
}
