import * as React from "react"
import { getContainerSetHooks } from "iti-react"
import { app } from "./_bl"

export const MyAppContext = React.createContext<typeof app>({} as any)

const hooks = getContainerSetHooks(MyAppContext)
export const useContainerSet = hooks.useContainerSet
export const useContainer = hooks.useContainer
