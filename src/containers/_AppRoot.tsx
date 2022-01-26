import React, { ReactNode, useMemo } from "react"
import { RootStoreContext2 } from "../containers/_container.hooks"
import { getMainPizzaAppContainer } from "../containers/_root.store"

export function PizzaAppWrapper({ children }: { children: ReactNode }) {
  const store = useMemo(() => getMainPizzaAppContainer(), [])

  return (
    <RootStoreContext2.Provider value={store}>
      {children}
    </RootStoreContext2.Provider>
  )
}
