import React, { useState, useEffect } from "react"

// -- Generic

export type ContainerGeneric<T> = {
  container?: T
  error?: Error
}
export function useGenericContainer<T>(
  containerPromise: Promise<T>,
): ContainerGeneric<T> {
  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState()

  // We can add optimizations later.
  useEffect(() => {
    containerPromise
      .then((container) => {
        setData(container)
      })
      .catch((e) => setError(e))
  }, [])

  return { container: data, error }
}
