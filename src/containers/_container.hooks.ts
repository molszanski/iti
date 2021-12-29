import React, { useContext } from "react"
import { useGenericContainer } from "../_library/library.hooks"

import type { AppContainer, SecondAppContainer } from "./_root.store"

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

  return useGenericContainer(root.getKitchenContainer(), {
    onContainerUpdate: (cb) => {
      root.on("containerUpdated", (update) => {
        if (update.key === "kitchen") {
          root.getKitchenContainer().then((kitchenContainer) => {
            cb(kitchenContainer)
          })
        }
      })
    },
  })
}

export function usePizzaPlaceContainer() {
  const root = useRootStore()
  return useGenericContainer(root.getPizzaPlaceContainer())
}

///

export const SecondAppContext = React.createContext<SecondAppContainer>(
  {} as any,
)
export function SeconAppContainer() {
  const store = useContext(SecondAppContext)
  return store
}

export function useSecondKitchenContainer() {
  const root = SeconAppContainer()
  console.log("using second kitchen container")

  return useGenericContainer(root.getKitchenContainer(), {
    onContainerUpdate: (cb) => {
      root.on("containerUpdated", (update) => {
        if (update.key === "kitchen") {
          root.getKitchenContainer().then((kitchenContainer) => {
            cb(kitchenContainer)
          })
        }
      })
    },
  })
}
