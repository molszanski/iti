import _ from "lodash"
import React, { useContext } from "react"
import {
  useGenericContainer,
  useBetterGenericContainer,
} from "../_library/library.hooks"

import type { AppContainer } from "./_root.store"
export const RootStoreContext = React.createContext<AppContainer>({} as any)

export function useRootStore(): AppContainer {
  const store = useContext(RootStoreContext)
  return store
}

/**
 * Return a map of keys to container and update functions
 *
 * @returns
 */
export function useAllSuperStores() {
  const root = useRootStore()
  const containerMap = root.getBetterKeys()

  type ContainerKeys = keyof ReturnType<typeof root.getBetterKeys>
  type Containers = ReturnType<typeof root.getBetterKeys>

  let containerDecoratedMap: {
    [K in ContainerKeys]: {
      _key: K
      _container: ReturnType<Containers[K]>
      onUpdate: () => void
    }
  } = {} as any

  _.forEach(containerMap, (contPromise, contKey) => {
    // @ts-ignore
    containerDecoratedMap[contKey] = {
      _container: contPromise(),
      _key: contKey,
      onUpdate: (cb: any) =>
        root.on("containerUpdated", async (update) => {
          if (update.key === contKey) {
            cb(await contPromise())
          }
        }),
    }
  })

  return containerDecoratedMap
}

export function useDandy() {
  const s = useAllSuperStores()

  const FFF: any = {}
  _.forEach(s, (v: any, k) => {
    FFF[k] = () =>
      useBetterGenericContainer(v._container, { onContainerUpdate: v.onUpdate })
  })
  return FFF
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

// export const SecondAppContext = React.createContext<SecondAppContainer>(
//   {} as any,
// )
// export function SeconAppContainer() {
//   const store = useContext(SecondAppContext)
//   return store
// }

// export function useSecondKitchenContainer() {
//   const root = SeconAppContainer()
//   console.log("using second kitchen container")

//   return useGenericContainer(root.getKitchenContainer(), {
//     onContainerUpdate: (cb) => {
//       root.on("containerUpdated", (update) => {
//         if (update.key === "kitchen") {
//           root.getKitchenContainer().then((kitchenContainer) => {
//             cb(kitchenContainer)
//           })
//         }
//       })
//     },
//   })
// }
