import type { RootContainer } from "./library.root-container"

export const wait = (w: number) => new Promise((r) => setTimeout(r, w))

export type UnPromisify<T> = T extends Promise<infer U> ? U : T

export type GetContainerFormat<ProviderFunction extends (...args: any) => any> =
  UnPromisify<ReturnType<ProviderFunction>>

export interface GenericRegistry {
  [K: string]: () => any
}

type Lib<Registry extends GenericRegistry> = (...args: any) => {
  [K in keyof Registry]: Registry[K]
}

export type ApplicationContainer<Reg extends GenericRegistry> = RootContainer<
  Lib<Reg>,
  ReturnType<Lib<Reg>>
>
