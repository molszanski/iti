import _ from "lodash"
import React, { useContext } from "react"
import { RootContainer } from "src/_library/library.root-container"
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
export function useAllSuperStores(appContainer: AppContainer) {
  const root = appContainer
  const containerMap = root.KKK

  type ContainerKeys = keyof typeof root["KKK"]
  type Containers = typeof root["KKK"]

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

export function useLol(appContainer: AppContainer) {
  const root = appContainer
  const s = useAllSuperStores(root)

  type ContainerKeys = keyof AppContainer["KKK"]
  type UnPromisify<T> = T extends Promise<infer U> ? U : T

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
export function useDandy() {
  const root = useRootStore()
  return useLol(root)
}
