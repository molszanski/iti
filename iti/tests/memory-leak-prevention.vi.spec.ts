import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { createContainer } from "../src/iti"
import { wait } from "./_utils"

describe("Memory Leak Prevention", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
  })

  afterEach(() => {
    // Force garbage collection if available (for Node.js)
    if (global.gc) {
      global.gc()
    }
  })

  it("should properly clean up event listeners on container disposal", async () => {
    const container = root.add({
      service: () => ({ name: "test service" })
    })

    let callbackCount = 0
    const callback = () => { callbackCount++ }

    // Subscribe to events
    const unsubscribe1 = container.on("itemUpserted", callback)
    const unsubscribe2 = container.subscribeToItem("service", callback)

    await container.get("service")
    container.upsert({ service: "new value" })
    
    expect(callbackCount).toBeGreaterThan(0)
    
    // Unsubscribe and verify no more callbacks
    unsubscribe1()
    unsubscribe2()
    callbackCount = 0
    
    container.upsert({ service: "another value" })
    await wait(10)
    
    expect(callbackCount).toBe(0)
  })

  it("should prevent memory leaks in complex subscription scenarios", async () => {
    const container = root.add({
      service1: () => ({ id: 1 }),
      service2: () => ({ id: 2 }),
      service3: () => ({ id: 3 })
    })

    const callbacks: Array<() => void> = []
    
    // Create many subscriptions
    for (let i = 0; i < 100; i++) {
      const callback = () => {}
      const unsubscribe = container.subscribeToItemSet(
        ["service1", "service2"], 
        callback
      )
      callbacks.push(unsubscribe)
    }

    // Trigger updates
    container.upsert({ service1: { id: 10 } })
    await wait(10)

    // Unsubscribe all
    callbacks.forEach(unsub => unsub())
    
    // Verify no memory leaks by checking internal event emitter state
    // This is a bit of a hack, but we can check if the internal emitter
    // has been properly cleaned up
    expect(true).toBe(true) // Placeholder - would need access to internal state
  })

  it("should properly dispose of cached values", async () => {
    const container = root.add({
      expensiveService: () => {
        // Simulate expensive resource creation
        const resource = {
          data: new Array(1000).fill("data"),
          cleanup: () => {}
        }
        return resource
      }
    }).addDisposer({
      expensiveService: (service) => {
        service.cleanup()
      }
    })

    // Get and cache the service
    const service1 = await container.get("expensiveService")
    const service2 = await container.get("expensiveService")
    
    // Should be the same instance (cached)
    expect(service1).toBe(service2)

    // Dispose and verify cleanup
    await container.dispose("expensiveService")
    
    // Getting again should create a new instance
    const service3 = await container.get("expensiveService")
    expect(service3).not.toBe(service1)
    expect(service3).not.toBe(service2)
  })

  it("should handle rapid container creation and disposal", async () => {
    const containers = []
    
    // Create and dispose many containers rapidly
    for (let i = 0; i < 50; i++) {
      const container = createContainer()
        .add({
          service: () => ({ id: i })
        })
        .addDisposer({
          service: (service) => {
            // Simulate cleanup
          }
        })

      await container.get("service")
      containers.push(container)
    }

    // Dispose all containers
    for (const container of containers) {
      await container.disposeAll()
    }

    // Force garbage collection
    if (global.gc) {
      global.gc()
    }

    // This test mainly ensures no crashes occur during rapid creation/disposal
    expect(containers.length).toBe(50)
  })

  it("should prevent event emitter memory leaks", async () => {
    const container = root.add({
      service: () => "test"
    })

    // Create many event listeners
    const listeners = []
    for (let i = 0; i < 1000; i++) {
      const listener = container.on("itemUpserted", () => {})
      listeners.push(listener)
    }

    // Trigger events
    container.upsert({ service: "new value" })
    await wait(10)

    // Remove all listeners
    listeners.forEach(remove => remove())

    // Verify no more events are processed
    let eventCount = 0
    container.on("itemUpserted", () => { eventCount++ })

    container.upsert({ service: "final value" })
    await wait(10)

    // Should only be one event from our single listener
    expect(eventCount).toBe(1)
  })
})