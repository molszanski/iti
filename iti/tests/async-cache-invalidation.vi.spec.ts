import { describe, expect, it, vi } from "vitest"
import { createContainer } from "../src/iti"

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

describe("Async cache invalidation", () => {
  it("does not let a replaced pending provider overwrite the sync cache", async () => {
    const oldPending = deferred<{ version: string }>()
    const oldService = { version: "old" }
    const newService = { version: "new" }
    const container = createContainer().add({
      service: () => oldPending.promise,
    })

    const oldRead = container.get("service")
    container.upsert({ service: async () => newService })
    await expect(container.get("service")).resolves.toBe(newService)

    oldPending.resolve(oldService)
    await expect(oldRead).resolves.toBe(oldService)

    expect(container.getSync("service")).toBe(newService)
  })

  it("invalidates a resolved async value when its provider is replaced", async () => {
    const oldService = { version: "old" }
    const newService = { version: "new" }
    const container = createContainer().add({
      service: async () => oldService,
    })

    await expect(container.get("service")).resolves.toBe(oldService)
    expect(container.getSync("service")).toBe(oldService)

    container.upsert({ service: async () => newService })
    const replacement = container.getSync("service")

    expect(replacement).toBeInstanceOf(Promise)
    await expect(replacement).resolves.toBe(newService)
  })

  it("invalidates a resolved async value after disposal", async () => {
    let instance = 0
    const disposer = vi.fn()
    const container = createContainer()
      .add({
        service: async () => ({ instance: ++instance }),
      })
      .addDisposer({ service: disposer })

    const first = await container.get("service")
    expect(container.getSync("service")).toBe(first)

    await container.dispose("service")
    const replacement = container.getSync("service")

    expect(disposer).toHaveBeenCalledOnce()
    expect(replacement).toBeInstanceOf(Promise)
    await expect(replacement).resolves.toEqual({ instance: 2 })
  })
})
