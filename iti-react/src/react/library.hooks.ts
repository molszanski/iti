import React, { useState, useEffect } from "react"
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
  subscribeFunction: (cb: (err: any, container: T) => void) => () => void,
  containerKey: string,
): ContainerGenericBettter<T> {
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
      containerPromise()
        .then((container) => {
          setData(container)
        })
        .catch((e) => {
          setError(e)
        })
    } catch (e) {
      setError(e)
    }
  }, [])

  return [data, error, containerKey]
}
