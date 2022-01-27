import React, { useState, useEffect } from "react"
import { UnPromisify } from "../_utils"

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
