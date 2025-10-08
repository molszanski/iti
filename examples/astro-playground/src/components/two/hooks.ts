import { useEffect, useState } from "react"

export function wrapPromise(promise: Promise<any>) {
  let status = "pending"
  let result: any
  let suspender = promise.then(
    (r) => {
      status = "success"
      result = r
    },
    (e) => {
      status = "error"
      result = e
    }
  )
  return {
    read() {
      //console.log(status);
      if (status === "pending") {
        throw suspender
      } else if (status === "error") {
        throw result
      } else if (status === "success") {
        return result
      }
    },
  }
}

/**
 * Interacts with suspense and waits for the promise to resolve
 */
export function usePromiseAndSuspense(promise: Promise<any>) {
  const [result, setResult] = useState<any>(null)
  useEffect(() => {
    const _result = wrapPromise(promise)
    setResult(_result)
  }, [promise])
  return result?.read()
}
