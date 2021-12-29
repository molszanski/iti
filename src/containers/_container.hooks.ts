import React, { useContext } from "react"
import { useGenericContainer } from "../_library/library.hooks"

import type { AppContainer } from "./_root.store"

export const RootStoreContext = React.createContext<AppContainer>({} as any)

export function useRootStore(): AppContainer {
  const store = useContext(RootStoreContext)
  return store
}

export function useAuthContainer() {
  const root = useRootStore()
  return useGenericContainer(root.getAuthContainer())
}

export function useAContainer() {
  const root = useRootStore()
  return useGenericContainer(root.getA_Container())
}

export function useBContainer() {
  const root = useRootStore()
  return useGenericContainer(root.getB_Container())
}

export function useKitchenContainer() {
  const root = useRootStore()
  const onContainerUpdate = () => {
    console.log("lol")
  }
  return useGenericContainer(root.getKitchenContainer())
}

export function usePizzaPlaceContainer() {
  const root = useRootStore()
  return useGenericContainer(root.getPizzaPlaceContainer())
}
