import React, { useContext } from "react"
import { getContainerSetHooks } from "snow-splash"
import { getProviders, PizzaAppContainer } from "./_root.store"

export const MyRootCont = React.createContext(<PizzaAppContainer>{})

let mega = getContainerSetHooks(getProviders, MyRootCont)
export const useContainerSet = mega.useContainerSet
// export const useRoot = mega.useRoot
// let f = useRoot()
// export const useContainer = mega.useContainer

export function useContainer() {
  const root = useContext(MyRootCont)
  return mega.useRootContainerMap(root.providerMap, root)
}
