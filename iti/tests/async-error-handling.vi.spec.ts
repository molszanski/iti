import { describe, it, expect, beforeEach } from "vitest"
import { createContainer } from "../src/iti"
import { wait } from "./_utils"

describe("Async Error Handling", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
  })

  it("should properly propagate async factory errors", async () => {
    const container = root.add({
      failingAsyncService: async () => {
        await wait(10)
        throw new Error("Async factory failed")
      },
      dependentService: (c) => ({
        name: "Dependent",
        async getFailingService() {
          return await c.failingAsyncService
        }
      })
    })

    // Test direct async factory error
    await expect(container.get("failingAsyncService")).rejects.toThrow("Async factory failed")

    // Test error propagation through dependencies
    const dependent = await container.get("dependentService")
    await expect(dependent.getFailingService()).rejects.toThrow("Async factory failed")
  })

  it("should handle partial async failures in getItemSet", async () => {
    const container = root.add({
      goodService: async () => {
        await wait(5)
        return "success"
      },
      badService: async () => {
        await wait(5)
        throw new Error("bad service failed")
      },
      anotherGoodService: "static value"
    })

    // getItemSet should fail if any service fails
    await expect(
      container.getItemSet(["goodService", "badService", "anotherGoodService"])
    ).rejects.toThrow("bad service failed")
  })

  it("should handle timeout scenarios in async factories", async () => {
    const container = root.add({
      slowService: async () => {
        await wait(1000) // Very slow
        return "slow result"
      },
      fastService: async () => {
        await wait(5)
        return "fast result"
      }
    })

    // This test ensures we don't have infinite waits
    const start = Date.now()
    
    try {
      await Promise.race([
        container.get("slowService"),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("timeout")), 100)
        )
      ])
      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toBe("timeout")
      expect(Date.now() - start).toBeLessThan(200)
    }
  })

  it("should properly handle disposer errors", async () => {
    const container = root.add({
      service: () => ({ name: "test service" })
    }).addDisposer({
      service: (service) => {
        throw new Error("disposer failed")
      }
    })

    await container.get("service")
    
    // Disposer errors should not crash the application
    await expect(container.dispose("service")).rejects.toThrow("disposer failed")
  })

  it("should handle errors in subscription callbacks", async () => {
    const container = root.add({
      service: () => "initial value"
    })

    const errorCallback = (err: any, value: any) => {
      throw new Error("subscription callback failed")
    }

    // Subscribe with error-prone callback
    const unsubscribe = container.subscribeToItem("service", errorCallback)
    
    // This should not crash despite callback error
    container.upsert({ service: "new value" })
    
    unsubscribe()
  })
})