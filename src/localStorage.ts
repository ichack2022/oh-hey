"use strict";

import { Memento } from "vscode";

export class LocalStorageService {
  constructor(private storage: Memento) {}

  public getValue<T>(key: string): T {
    return this.storage.get<T>(key, );
  }

  public setValue<T>(key: string, value: T) {
    this.storage.update(key, value);
  }

  public removeValue<T>(key: string) {
    this.storage.update(key, undefined);
  }
}
