import _ from "lodash"
import React, { useContext } from "react"
import { useBetterGenericContainer } from "../_library/library.hooks"

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
      _container: () => ReturnType<Containers[K]>
      onUpdate: () => void
    }
  } = {} as any

  _.forEach(containerMap, (contPromise, contKey) => {
    // @ts-ignore
    containerDecoratedMap[contKey] = {
      _container: contPromise,
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
type UnPromisify<T> = T extends Promise<infer U> ? U : T

export function useDandy() {
  const s = useAllSuperStores()

  type ContainerKeys = keyof AppContainer["KKK"]

  let FFF: {
    [K in ContainerKeys]: () => [
      UnPromisify<ReturnType<AppContainer["KKK"][K]>>,
      any,
    ]
  } = {} as any
  _.forEach(s, (v, k) => {
    // @ts-ignore
    FFF[k] = () => {
      const cont = v._container
      // @ts-ignore
      const retCont = useBetterGenericContainer(cont, {
        onContainerUpdate: v.onUpdate,
      })

      return retCont
    }
  })

  return FFF
}
