import React, { useState, useEffect } from "react"

// -- Generic

export type ContainerGeneric<T> = {
  container?: T
  error?: Error
}

/* OK */
interface Controls {
  onContainerUpdate(cb: (container: any) => void): void
}

export function useGenericContainer<T>(
  containerPromise: Promise<T>,
  controls?: Controls,
): ContainerGeneric<T> {
  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState()

  useEffect(() => {
    if (controls) {
      controls.onContainerUpdate((container) => {
        setData(container)
      })
    }
  }, [controls])

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
