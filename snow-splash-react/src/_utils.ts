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
