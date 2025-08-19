// Core types for the key-value storage
export interface KVStorage<T = any> {
  readonly cache: Record<string, T>
  readonly context: Record<string, T | (() => T)>
  readonly disposeCtx: Record<string, (value: T) => void | Promise<void>>
  readonly events: EventEmitter<StorageEvents<T>>
}

export interface StorageEvents<T> {
  itemSet: (payload: { key: string; value: T }) => void
  itemDeleted: (payload: { key: string }) => void
  itemDisposed: (payload: { key: string }) => void
}

export interface EventEmitter<Events> {
  on<K extends keyof Events>(event: K, callback: Events[K]): () => void
  emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void
}

// Utility types
export type UnwrapFunction<T> = T extends () => infer U ? U : T
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
export type ResolvedValue<T> = UnwrapPromise<UnwrapFunction<T>>

// Main function signatures
export declare function createKVStorage(): KVStorage

export declare function set<T>(
  storage: KVStorage<T>,
  key: string,
  value: T | (() => T)
): KVStorage<T>

export declare function get<T>(
  storage: KVStorage<T>,
  key: string
): ResolvedValue<T>

export declare function has<T>(
  storage: KVStorage<T>,
  key: string
): boolean

export declare function deleteItem<T>(
  storage: KVStorage<T>,
  key: string
): KVStorage<T>

export declare function addDisposer<T>(
  storage: KVStorage<T>,
  key: string,
  disposer: (value: T) => void | Promise<void>
): KVStorage<T>

export declare function dispose<T>(
  storage: KVStorage<T>,
  key: string
): Promise<void>

export declare function disposeAll<T>(
  storage: KVStorage<T>
): Promise<void>

// Batch operations
export declare function setMany<T>(
  storage: KVStorage<T>,
  items: Record<string, T | (() => T)>
): KVStorage<T>

export declare function getMany<T>(
  storage: KVStorage<T>,
  keys: string[]
): Promise<Record<string, ResolvedValue<T>>>

// Subscription helpers
export declare function subscribe<T>(
  storage: KVStorage<T>,
  key: string,
  callback: (value: T | null, error?: Error) => void
): () => void

export declare function subscribeMany<T>(
  storage: KVStorage<T>,
  keys: string[],
  callback: (values: Record<string, T | null>, error?: Error) => void
): () => void

// Utility functions
export declare function keys<T>(storage: KVStorage<T>): string[]
export declare function values<T>(storage: KVStorage<T>): Promise<T[]>
export declare function entries<T>(storage: KVStorage<T>): Promise<Array<[string, T]>>
export declare function size<T>(storage: KVStorage<T>): number
export declare function clear<T>(storage: KVStorage<T>): Promise<void>

// Type-safe builder pattern
export interface KVStorageBuilder<T = {}> {
  set<K extends string, V>(
    key: K,
    value: V | (() => V)
  ): KVStorageBuilder<T & Record<K, V>>
  
  setMany<U extends Record<string, any>>(
    items: U
  ): KVStorageBuilder<T & U>
  
  addDisposer<K extends keyof T>(
    key: K,
    disposer: (value: ResolvedValue<T[K]>) => void | Promise<void>
  ): KVStorageBuilder<T>
  
  build(): KVStorage<T>
}

export declare function createBuilder<T = {}>(): KVStorageBuilder<T>