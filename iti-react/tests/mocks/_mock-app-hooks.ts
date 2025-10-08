import React from "react"
import { getContainerHooks } from "../../src/react/library.hook-generator"
import { MockAppNode } from "./_mock-app-container"

export const MyRootCont = React.createContext(<MockAppNode>{})

let mega = getContainerHooks(MyRootCont)
export const useMockAppItemSet = mega.useItems
export const useMockAppItem = mega.useItem
