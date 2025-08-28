import React from "react"
import { getItemSetHooks } from "../../src/react/library.hook-generator"
import { MockAppNode } from "./_mock-app-container"

export const MyRootCont = React.createContext(<MockAppNode>{})

let mega = getItemSetHooks(MyRootCont)
export const useMockAppItemSet = mega.useItemSet
export const useMockAppItem = mega.useItem
