import _ from "lodash"
import React, { useState, useEffect } from "react"
import { UnPromisify } from "./_utils"

// -- Generic

export type ContainerGeneric<T> = {
  container?: T
  error?: Error
  key?: string
}

export type ContainerGenericBettter<T> = [
  container?: T,
  error?: Error,
  key?: string,
]

export function useBetterGenericContainer<T>(
  containerPromise: () => Promise<T>,
  controls: {
    onContainerUpdate(cb: (container: T) => void): void
    unsubscribeFunction?: () => void
    subscribeFunction?(cb: (container: T) => void): () => void
    containerKey: string
  },
): ContainerGenericBettter<T> {
  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState()

  // Update container
  useEffect(() => {
    if (controls.onContainerUpdate) {
      controls.onContainerUpdate((container) => {
        setData(container)
      })
      return controls.unsubscribeFunction
    }
    if (controls.subscribeFunction) {
      return controls.subscribeFunction((cont) => setData(cont))
    }
  }, [controls])

  // We can add optimizations later.
  useEffect(() => {
    containerPromise()
      .then((container) => {
        setData(container)
      })
      .catch((e) => setError(e))
  }, [])

  return [data, error, controls.containerKey]
}

export function useRootStores<
  ContMap extends {
    [CK in keyof ContMap]: ContMap[CK]
  },
  /**
   * Basically a nice api for hooks
   * {
   *   name: () => [containerInstance, errr ]
   * }
   */
  ContainerGetter extends {
    [CK in keyof ContMap]: ContMap[CK] extends (...args: any) => any
      ? () => [UnPromisify<ReturnType<ContMap[CK]>>, any, CK]
      : never
  },
>(
  providerMap: ContMap,
  //@ts-ignore
  root: RootContainer,
) {
  let containerDecoratedMap: {
    [K in keyof ContMap]: {
      _key: K
      _container: () => ContMap[K]
      onUpdate: () => void
    }
  } = {} as any

  _.forEach(providerMap, (contPromise, contKey) => {
    // @ts-ignore
    containerDecoratedMap[contKey] = {
      _container: contPromise,
      _key: contKey,
      onUpdate: (cb: any) =>
        // @ts-ignore
        root.on("containerUpdated", async (update) => {
          if (update.key === contKey) {
            cb(await contPromise())
          }
        }),
    }
  })

  let FFF: ContainerGetter = {} as any
  _.forEach(containerDecoratedMap, (v, k) => {
    // @ts-ignore
    FFF[k] = () => {
      const cont = v._container
      const retCont = useBetterGenericContainer(cont, {
        onContainerUpdate: v.onUpdate,
        containerKey: k,
      })

      return retCont
    }
  })

  return FFF
}
