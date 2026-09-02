import { describe, expect, it, vi } from "vitest"
import { createContainer } from "../src/iti"

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

describe("Concurrent async access", () => {
  it("shares one pending provider result between get calls", async () => {
    const pending = deferred<{ id: number }>()
    const provider = vi.fn(() => pending.promise)
    const container = createContainer().add({ service: provider })

    const reads = Array.from({ length: 10 }, () => container.get("service"))

    expect(provider).toHaveBeenCalledTimes(1)
    expect(reads.every((read) => read === reads[0])).toBe(true)

    const service = { id: 1 }
    pending.resolve(service)
    const results = await Promise.all(reads)

    expect(results.every((result) => result === service)).toBe(true)
  })

  it("shares pending providers between overlapping getItems calls", async () => {
    const pendingA = deferred<{ name: string }>()
    const pendingB = deferred<{ name: string }>()
    const providerA = vi.fn(() => pendingA.promise)
    const providerB = vi.fn(() => pendingB.promise)
    const container = createContainer().add({
      serviceA: providerA,
      serviceB: providerB,
    })

    const first = container.getItems(["serviceA", "serviceB"])
    const second = container.getItems(["serviceB"])

    expect(providerA).toHaveBeenCalledTimes(1)
    expect(providerB).toHaveBeenCalledTimes(1)

    const serviceA = { name: "A" }
    const serviceB = { name: "B" }
    pendingA.resolve(serviceA)
    pendingB.resolve(serviceB)

    await expect(first).resolves.toEqual({ serviceA, serviceB })
    await expect(second).resolves.toEqual({ serviceB })
  })
})
