import React, { useContext } from "react"
import { getContainerSetHooks } from "../../src/react/library.hook-generator"
import { getProviders, MockAppContainer } from "./_mock-app-container"

export const MyRootCont = React.createContext(<MockAppContainer>{})

let mega = getContainerSetHooks(getProviders, MyRootCont)
export const useMockAppContainerSet = mega.useContainerSet
export function useMockAppContainer() {
  const root = useContext(MyRootCont)
  return mega.useRootContainerMap(root.providerMap, root)
}
