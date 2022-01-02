import _ from "lodash"
import React, { useContext } from "react"
import type { RootContainer } from "../_library/library.root-container"
import { useBetterGenericContainer } from "../_library/library.hooks"
import type { lol } from "./_root.store"

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

  return FFF
}

export function useNewDandy() {
  const root = useRoot2()
  return useStores2(root.KKK, root)
}
