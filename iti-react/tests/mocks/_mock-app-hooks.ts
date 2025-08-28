import React from "react"
import { getContainerSetHooks } from "../../src/react/library.hook-generator"
import { MockAppNode } from "./_mock-app-container"

export const MyRootCont = React.createContext(<MockAppNode>{})

let mega = getContainerSetHooks(MyRootCont)
export const useMockAppItemSet = mega.useItemSet
export const useMockAppItem = mega.useItem
