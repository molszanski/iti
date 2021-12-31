import _ from "lodash"
import React, { useContext } from "react"
import { useGenericContainer } from "../_library/library.hooks"

import type { AppContainer, SecondAppContainer } from "./_root.store"

export const RootStoreContext = React.createContext<AppContainer>({} as any)

export function useRootStore(): AppContainer {
  const store = useContext(RootStoreContext)
  return store
}

export function useAllStores() {
  const root = useRootStore()

  const s = root.getKeys()
  let k = s.kitchen()
  root.on("containerUpdated", async (update) => {
    if (update.key === "kitchen") {
      let kc = await s.kitchen()
    }
  })

  return {
    kitchen: {
      container: s.kitchen(),
      onUpdate: (cb: any) =>
        root.on("containerUpdated", async (update) => {
          if (update.key === "kitchen") {
            let kc = await s.kitchen()
            cb(kc)
          }
        }),
    },
  }
}

/**
 * Return a map of keys to container and update functions
 *
 * @returns
 */
export function useAllSuperStores() {
  const root = useRootStore()
  const containerMap = root.getKeys()

  type ContainerKeys = keyof ReturnType<typeof root.getKeys>
  type Containers = ReturnType<typeof root.getKeys>

  // type ContainerWrappedData = typeof decoratedContainerMap[0]
  let FFFFF: {
    [K in ContainerKeys]: {
      _key: K
      _container: ReturnType<Containers[K]>
      onUpdate: () => void
    }
  } = {} as any

  _.forEach(containerMap, (contPromise, contKey) => {
    // @ts-ignore
    FFFFF[contKey] = {
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

  // const containers = Object.entries(containerMap)
  // const TK = Object.keys(containerMap) as any as keyof typeof containerMap

  // const decoratedContainerMap = containers.map(
  //   ([containerKey, containerPromise]) => ({
  //     _container: containerPromise() as any,
  //     _key: containerKey,
  //     [containerKey]: containerPromise(),
  //     onUpdate: (cb: any) =>
  //       root.on("containerUpdated", async (update) => {
  //         if (update.key === containerKey) {
  //           cb(await containerPromise())
  //         }
  //       }),
  //   }),
  // )
  // type ContainerWrappedData = typeof decoratedContainerMap
  // type BBB = {
  //   [K in ContainerKeys]: ContainerWrappedData
  // }
  // type BBB2 = {
  //   [K in ContainerKeys]: {
  //     _container: number
  //     _key: number
  //     $K: string
  //     [index: K]: number
  //   }
  // }

  // let x: Record<ContainerKeys, ContainerWrappedData> = {} as any
  // decoratedContainerMap.forEach((v, k) => {
  //   // @ts-ignore
  //   x[v._key] = v
  // })

  // return x
  return FFFFF
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
