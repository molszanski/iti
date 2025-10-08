import * as React from "react"
import { getContainerHooks } from "iti-react"
import { app } from "./_bl"

export const MyAppContext = React.createContext<typeof app>({} as any)

const hooks = getContainerHooks(MyAppContext)
export const useItems = hooks.useItems
export const useItem = hooks.useItem
