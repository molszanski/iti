import React, { ReactNode, useMemo } from "react"
import { MyRootCont } from "../containers/_container.hooks"
import { getMainPizzaAppContainer } from "../containers/_root.store"

export function PizzaAppWrapper({ children }: { children: ReactNode }) {
  const store = useMemo(() => getMainPizzaAppContainer(), [])

  return <MyRootCont.Provider value={store}>{children}</MyRootCont.Provider>
}
