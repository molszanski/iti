import React, { useContext } from "react"
import { getContainerSetHooks } from "../../src/react/library.hook-generator"
import { MockAppNode } from "./_mock-app-container"

export const MyRootCont = React.createContext(<MockAppNode>{})

let mega = getContainerSetHooks(MyRootCont)
export const useMockAppContainerSet = mega.useContainerSet
export function useMockAppContainer() {
  const root = useContext(MyRootCont)
  //@ts-ignore
  return mega.useRootContainerMap(root)
}
