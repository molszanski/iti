export const wait = (w: number) => new Promise((r) => setTimeout(r, w))

export type UnPromisify<T> = T extends Promise<infer U> ? U : T

export type GetContainerFormat<ProviderFunction extends (...args: any) => any> =
  UnPromisify<ReturnType<ProviderFunction>>
