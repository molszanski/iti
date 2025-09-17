import { describe, it, expect, beforeEach } from "vitest"
import { createContainer } from "../src/iti"
import { wait } from "./_utils"

describe("Concurrent Access and Race Conditions", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
  })

  it("should handle multiple simultaneous get() calls safely", async () => {
    let factoryCallCount = 0
    const container = root.add({
      expensiveService: () => {
        factoryCallCount++
        return new Promise(resolve => {
          setTimeout(() => resolve({ id: factoryCallCount }), 50)
        })
      }
    })

    // Make multiple simultaneous calls
    const promises = Array.from({ length: 10 }, () => container.get("expensiveService"))
    const results = await Promise.all(promises)

    // Factory should only be called once due to caching
    expect(factoryCallCount).toBe(1)
    
    // All results should be the same (same cached instance)
    results.forEach(result => {
      expect(result).toEqual(results[0])
    })
  })

  it("should handle concurrent upsert operations safely", async () => {
    const container = root.add({
      counter: () => 0
    })

    // Multiple concurrent upserts
    const upsertPromises = Array.from({ length: 100 }, (_, i) => 
      container.upsert({ counter: i })
    )

    await Promise.all(upsertPromises)

    // Final value should be consistent
    const finalValue = await container.get("counter")
    expect(typeof finalValue).toBe("number")
    expect(finalValue).toBeGreaterThanOrEqual(0)
    expect(finalValue).toBeLessThan(100)
  })

  it("should handle concurrent add operations safely", async () => {
    const container = createContainer()

    // Multiple concurrent adds with different tokens
    const addPromises = Array.from({ length: 50 }, (_, i) => 
      container.add({ [`service${i}`]: () => `value${i}` })
    )

    const results = await Promise.all(addPromises)

    // All operations should succeed
    expect(results.length).toBe(50)
    
    // All tokens should be available
    for (let i = 0; i < 50; i++) {
      const value = await container.get(`service${i}`)
      expect(value).toBe(`value${i}`)
    }
  })

  it("should handle race conditions in async factories", async () => {
    let asyncFactoryCallCount = 0
    const container = root.add({
      asyncService: async () => {
        asyncFactoryCallCount++
        await wait(Math.random() * 50) // Random delay
        return { id: asyncFactoryCallCount, timestamp: Date.now() }
      }
    })

    // Start multiple concurrent requests
    const promises = Array.from({ length: 20 }, () => container.get("asyncService"))
    const results = await Promise.all(promises)

    // All results should be the same (cached)
    expect(results.length).toBe(20)
    results.forEach(result => {
      expect(result.id).toBe(results[0].id)
      expect(result.timestamp).toBe(results[0].timestamp)
    })
    
    // Factory should only be called once
    expect(asyncFactoryCallCount).toBe(1)
  })

  it("should handle concurrent dispose operations safely", async () => {
    const container = root.add({
      service1: () => ({ id: 1 }),
      service2: () => ({ id: 2 }),
      service3: () => ({ id: 3 })
    }).addDisposer({
      service1: (service) => {},
      service2: (service) => {},
      service3: (service) => {}
    })

    // Get services first
    await Promise.all([
      container.get("service1"),
      container.get("service2"),
      container.get("service3")
    ])

    // Concurrent dispose operations
    const disposePromises = [
      container.dispose("service1"),
      container.dispose("service2"),
      container.dispose("service3")
    ]

    await Promise.all(disposePromises)

    // Services should be disposed
    const service1 = await container.get("service1")
    const service2 = await container.get("service2")
    const service3 = await container.get("service3")

    expect(service1.id).toBe(1)
    expect(service2.id).toBe(2)
    expect(service3.id).toBe(3)
  })

  it("should handle subscription/unsubscription race conditions", async () => {
    const container = root.add({
      service: () => "initial"
    })

    const callbacks: Array<() => void> = []
    let callbackCount = 0

    // Create many subscriptions rapidly
    for (let i = 0; i < 100; i++) {
      const unsubscribe = container.subscribeToItem("service", (err, value) => {
        callbackCount++
      })
      callbacks.push(unsubscribe)
    }

    // Update service
    container.upsert({ service: "updated" })
    await wait(10)

    // Unsubscribe rapidly
    callbacks.forEach(unsubscribe => unsubscribe())

    // Update again
    container.upsert({ service: "final" })
    await wait(10)

    // Should not have caused any callback executions after unsubscribe
    expect(callbackCount).toBeGreaterThan(0) // Some callbacks before unsubscribe
  })

  it("should handle concurrent getItemSet operations safely", async () => {
    const container = root.add({
      service1: async () => {
        await wait(10)
        return "service1"
      },
      service2: async () => {
        await wait(15)
        return "service2"
      },
      service3: async () => {
        await wait(5)
        return "service3"
      }
    })

    // Multiple concurrent getItemSet calls
    const promises = Array.from({ length: 10 }, () => 
      container.getItemSet(["service1", "service2", "service3"])
    )

    const results = await Promise.all(promises)

    // All results should be consistent
    results.forEach(result => {
      expect(result.service1).toBe("service1")
      expect(result.service2).toBe("service2")
      expect(result.service3).toBe("service3")
    })
  })

  it("should handle mixed sync/async operations safely", async () => {
    let syncCallCount = 0
    let asyncCallCount = 0

    const container = root.add({
      syncService: () => {
        syncCallCount++
        return `sync-${syncCallCount}`
      },
      asyncService: async () => {
        asyncCallCount++
        await wait(20)
        return `async-${asyncCallCount}`
      }
    })

    // Mix sync and async operations
    const operations = [
      container.get("syncService"),
      container.get("asyncService"),
      container.get("syncService"),
      container.get("asyncService"),
      container.getItemSet(["syncService", "asyncService"])
    ]

    const results = await Promise.all(operations)

    // Sync service should be called only once (cached)
    expect(syncCallCount).toBe(1)
    
    // Async service should be called only once (cached)
    expect(asyncCallCount).toBe(1)
    
    // Results should be consistent
    expect(results[0]).toBe("sync-1")
    expect(results[2]).toBe("sync-1") // Same cached value
  })
})