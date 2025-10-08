import * as React from "react"
import { getItemSetHooks } from "iti-react"
import { app } from "./_bl"

export const MyAppContext = React.createContext<typeof app>({} as any)

const hooks = getItemSetHooks(MyAppContext)
export const useItemSet = hooks.useItemSet
export const useItem = hooks.useItem
