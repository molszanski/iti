import React, { useContext, useState, useEffect } from "react"
import type { A_Container } from "./container.a"
import type { RootContainer } from "./_root.store"

export const RootStoreContext = React.createContext<RootContainer>({} as any)
export function useRootStore(): RootContainer {
  const store = useContext(RootStoreContext)
  return store
}

type Container = {
  container?: A_Container
  error?: Error
}
export function useAContainer(): Container {
  const root = useRootStore()

  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState()

  // We can add optimizations later.
  useEffect(() => {
    root
      .getA_Container()
      .then((container) => {
        setData(container)
      })
      .catch((e) => setError(e))
  }, [])

  return { container: data, error }
}
