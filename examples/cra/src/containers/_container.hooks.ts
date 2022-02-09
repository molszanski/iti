import React, { useContext } from "react"
import { getContainerSetHooks } from "snow-splash"
import { PizzaAppContainer } from "./_root.store"

export const MyRootCont = React.createContext(<PizzaAppContainer>{})

let mega = getContainerSetHooks(MyRootCont)
export const useContainerSet = mega.useContainerSet
export const useContainer = mega.useContainer
