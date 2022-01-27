import React, { useContext } from "react"
import { getContainerSetHooks } from "./_container.hook.gen"
import { getProviders, PizzaAppContainer } from "./_root.store"

export const RootStoreContext = React.createContext<PizzaAppContainer>(
  {} as any,
)

let mega = getContainerSetHooks(getProviders, RootStoreContext)
export const useContainerSet = mega.useContainerSet
export const useContainerSetNew = mega.useContainerSetNew
// export const useRoot = mega.useRoot
// let f = useRoot()
// export const useContainer = mega.useContainer

export function useContainer() {
  const root = useContext(RootStoreContext)
  return mega.useRootContainerMap(root.providerMap, root)
}
