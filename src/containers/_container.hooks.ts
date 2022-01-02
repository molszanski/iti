import _ from "lodash"
import React, { useContext } from "react"
import type { RootContainer } from "../_library/library.root-container"
import { useBetterGenericContainer } from "../_library/library.hooks"

import type { AppContainer, lol } from "./_root.store"
export const RootStoreContext = React.createContext<AppContainer>({} as any)

export function useRootStore(): AppContainer {
  const store = useContext(RootStoreContext)
  return store
}

export const RootStoreContext2 = React.createContext<ReturnType<typeof lol>>(
  {} as any,
)
function useRoot2() {
  let k = useContext(RootStoreContext2)
  return k
}
type UnPromisify<T> = T extends Promise<infer U> ? U : T
function useStores2<
  ContMap extends {
    [CK in keyof ContMap]: ContMap[CK] extends (...args: any) => any
      ? ContMap[CK]
      : never
  },
  ContainerKeys extends keyof ContMap,
  Lol extends {
    [CK in keyof ContMap]: ContMap[CK] extends (...args: any) => any
      ? () => [UnPromisify<ReturnType<ContMap[CK]>>, any]
      : never
  },
>(
  containerMap: ContMap,
  //@ts-ignore
  root: RootContainer,
) {
  let containerDecoratedMap: {
    [K in ContainerKeys]: {
      _key: K
      _container: () => ContMap[K]
      onUpdate: () => void
    }
  } = {} as any

  _.forEach(containerMap, (contPromise, contKey) => {
    // @ts-ignore
    containerDecoratedMap[contKey] = {
      _container: contPromise,
      _key: contKey,
      onUpdate: (cb: any) =>
        // @ts-ignore
        root.on("containerUpdated", async (update) => {
          if (update.key === contKey) {
            // @ts-ignore
            cb(await contPromise())
          }
        }),
    }
  })
  console.log("mm,", containerDecoratedMap)

  let FFF: Lol = {} as any
  _.forEach(containerDecoratedMap, (v, k) => {
    // @ts-ignore
    FFF[k] = () => {
      // @ts-ignore
      const cont = v._container
      // @ts-ignore
      const retCont = useBetterGenericContainer(cont, {
        // @ts-ignore
        onContainerUpdate: v.onUpdate,
      })

      return retCont
    }
  })

  return FFF as any as Lol
}

// let r = useRoot2()
// let k = useStores2(r.KKK, r)
export function useNewDandy() {
  const root = useRoot2()
  return useStores2(root.KKK, root)
}

// let k2 = useLol2()
// useLol2
export function useLol2(appContainer: AppContainer) {
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

  return FFF
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
