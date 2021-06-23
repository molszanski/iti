import React, { useContext, useState, useEffect } from "react"
import type { A_Container } from "./container.a"
import type { AuthContainer } from "./container.auth"
import type { B_Container } from "./container.b"
import type { RootContainer } from "./_root.store"

// -- Generic

type ContainerGeneric<T> = {
  container?: T
  error?: Error
}
export function useGenericContainer<T>(
  containerPromise: Promise<T>,
): ContainerGeneric<T> {
  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState()

  // We can add optimizations later.
  useEffect(() => {
    containerPromise
      .then((container) => {
        setData(container)
      })
      .catch((e) => setError(e))
  }, [])

  return { container: data, error }
}

// -- Details

export const RootStoreContext = React.createContext<RootContainer>({} as any)
export function useRootStore(): RootContainer {
  const store = useContext(RootStoreContext)
  return store
}

export function useAuthContainer(): ContainerGeneric<AuthContainer> {
  const root = useRootStore()
  return useGenericContainer(root.getAuthContainer())
}

export function useAContainer(): ContainerGeneric<A_Container> {
  const root = useRootStore()
  return useGenericContainer(root.getA_Container())
}

export function useBContainer(): ContainerGeneric<B_Container> {
  const root = useRootStore()
  return useGenericContainer(root.getB_Container())
}
