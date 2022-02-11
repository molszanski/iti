export type UnPromisify<T> = T extends Promise<infer U> ? U : T

export type GetContainerFormat<ProviderFunction extends (...args: any) => any> =
  UnPromisify<ReturnType<ProviderFunction>>

export function addGetter(object, key, fn: any) {
  Object.defineProperty(object, key, {
    get() {
      return fn()
    },
    enumerable: true,
  })
}

export type Assign4<OldContext extends object, NewContext extends object> = {
  [Token in keyof ({
    [K in keyof OldContext]: OldContext[K]
  } & {
    [K in keyof NewContext]: NewContext[K]
  })]: Token extends keyof NewContext
    ? NewContext[Token]
    : Token extends keyof OldContext
    ? OldContext[Token]
    : never
}
