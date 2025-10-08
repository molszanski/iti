import React, { useContext } from "react"
import { getContainerHooks } from "iti-react"
import { PizzaAppContainer } from "./_root.store"

export const MyRootCont = React.createContext(<PizzaAppContainer>{})

let mega = getContainerHooks(MyRootCont)
export const useContainerSet = mega.useContainerSet
export const useContainer = mega.useContainer
