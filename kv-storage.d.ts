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

// Main container interface with chained methods
export interface Container<T = {}> {
  // Core methods that return new containers
  add<U extends Record<string, any>>(
    items: U | ((context: ContextGetter<T>) => U)
  ): Container<T & U>
  
  upsert<U extends Record<string, any>>(
    items: U | ((context: ContextGetter<T>) => U)
  ): Container<T & U>
  
  addDisposer<U extends Record<string, (value: any) => void | Promise<void>>>(
    disposers: U | ((context: ContextGetter<T>) => U)
  ): Container<T>
  
  delete<K extends keyof T>(key: K): Container<Omit<T, K>>
  
  // Getter methods
  get<K extends keyof T>(key: K): ResolvedValue<T[K]>
  
  getMany<K extends keyof T>(keys: K[]): Promise<{ [P in K]: ResolvedValue<T[P]> }>
  
  has<K extends keyof T>(key: K): boolean
  
  // Utility methods
  keys(): (keyof T)[]
  
  size(): number
  
  // Disposal methods
  dispose<K extends keyof T>(key: K): Promise<void>
  
  disposeAll(): Promise<void>
  
  // Subscription methods
  subscribe<K extends keyof T>(
    key: K,
    callback: (value: ResolvedValue<T[K]> | null, error?: Error) => void
  ): () => void
  
  subscribeMany<K extends keyof T>(
    keys: K[],
    callback: (values: { [P in K]: ResolvedValue<T[P]> | null }, error?: Error) => void
  ): () => void
  
  // Event emitter access
  on<E extends keyof StorageEvents<T>>(event: E, callback: StorageEvents<T>[E]): () => void
}

// Context getter type (similar to iti)
export type ContextGetter<T> = {
  [K in keyof T]: ResolvedValue<T[K]>
}

// Factory function
export declare function createContainer(): Container<{}>

// Alternative name for backward compatibility
export declare const createKVStorage: typeof createContainer