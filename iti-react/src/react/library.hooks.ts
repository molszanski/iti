import React, { useState, useEffect } from "react"
// -- Generic

export type ContainerGeneric<T> = {
  container?: T
  error?: Error
  key?: string
}

export type ContainerGenericBetter<T> = [
  container?: T,
  error?: Error,
  key?: string,
]

export function useBetterGenericContainer<T>(
  containerPromise: () => Promise<T>,
  subscribeFunction: (cb: (err: any, container: T) => void) => () => void,
  containerKey: string,
): ContainerGenericBetter<T> {
  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState<any>(undefined)

  // Update container
  useEffect(() => {
    return subscribeFunction((err, cont) => {
      if (err) {
        setError(err)
        setData(null)
      }
      setData(cont)
    })
  }, [subscribeFunction])

  // We can add optimizations later.
  useEffect(() => {
    try {
      // Apparently it will not always be a promise???
      // Not sure what I meant to code :/
      const providedValue = containerPromise()
      if (providedValue instanceof Promise) {
        providedValue
          .then((container) => {
            setData(container)
          })
          .catch((e) => {
            setError(e)
          })
      } else {
        setData(providedValue)
      }
    } catch (e) {
      setError(e)
    }
  }, [])

  return [data, error, containerKey]
}
