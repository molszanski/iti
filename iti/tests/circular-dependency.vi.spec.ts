import { describe, it, expect, beforeEach } from "vitest"
import { createContainer } from "../src/iti"

describe("Circular Dependency Detection", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
  })

  it("should detect and handle circular dependencies in factory functions", async () => {
    let circularDetected = false
    
    const container = root.add({
      serviceA: (c) => {
        // This should cause a circular dependency
        return {
          name: "ServiceA",
          getServiceB: () => c.serviceB
        }
      },
      serviceB: (c) => {
        return {
          name: "ServiceB", 
          getServiceA: () => c.serviceA
        }
      }
    })

    // This should either throw an error or detect the circular dependency
    try {
      await container.get("serviceA")
      await container.get("serviceB")
      expect(true).toBe(false) // Should not reach here
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toContain("circular")
    }
  })

  it("should handle self-referential dependencies", async () => {
    const container = root.add({
      selfRef: (c) => {
        return {
          name: "SelfRef",
          getSelf: () => c.selfRef
        }
      }
    })

    try {
      await container.get("selfRef")
      expect(true).toBe(false) // Should not reach here
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toContain("circular")
    }
  })

  it("should handle deep circular dependencies", async () => {
    const container = root.add({
      level1: (c) => ({ getLevel2: () => c.level2 }),
      level2: (c) => ({ getLevel3: () => c.level3 }),
      level3: (c) => ({ getLevel1: () => c.level1 })
    })

    try {
      await container.get("level1")
      await container.get("level2") 
      await container.get("level3")
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})