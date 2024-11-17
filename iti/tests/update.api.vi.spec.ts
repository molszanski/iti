import { describe, it, expect, vi, beforeEach } from "vitest"
import { createContainer } from "../src/iti"
import { wait } from "./_utils"

describe("Deleting and destructuring: ", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
  })
  it("should be able to store null", () => {
    let r = root.add({ a: "A", b: null })

    expect(r.get("a")).toBe("A")
    expect(r.get("b")).toBe(null)
  })

  it("should be able to upsert null and back", () => {
    let r = root.add({ a: "A", b: "B" })

    // normal state
    expect(r.get("a")).toBe("A")
    expect(r.get("b")).toBe("B")

    // upsert null
    r.upsert({ b: null })
    expect(r.get("b")).toBe(null)

    // tokens should be fine too
    expect(r.getTokens()).toMatchObject({ a: "a", b: "b" })

    // update B from null to a Primitive
    r.upsert({ b: "new B" })
    expect(r.get("b")).toBe("new B")
  })

  it("should be able to delete a token", () => {
    let r = root.add({ a: "A", b: "B", c: "C" })

    expect(r.getTokens()).toMatchObject({ a: "a", b: "b", c: "c" })

    let updated = r.delete("b")
    expect(r.getTokens()).toMatchObject({ a: "a", c: "c" })

    // should throw
    expect(() => {
      // @ts-expect-error
      updated.get("b")
    }).toThrow()
  })

  it("should send containerUpdated event on overwrite", async () => {
    const cb = vi.fn()
    root.on("containerDeleted", async (k) => {
      expect(k.key).toBe("b")
      root.on("containerUpserted", (k) => {
        expect(k.key).toBe("b")
        expect(k.newContainer).toBe("new B")
        cb()
      })
      await wait(5)
      root.upsert({ b: "new B" })
    })

    root.add({ a: "A", b: "B" }).delete("b")
    await wait(20)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it("should send containerUpdated event on overwrite", async () => {
    const node = root.add(() => ({
      a: "A",
      b: "B",
    }))
    const f1 = vi.fn()
    const f2 = vi.fn()

    node.subscribeToContainer("a", f1)
    node.subscribeToContainerSet(["a", "b"], f2)

    node.delete("a")

    await wait(10)

    expect(f1).toHaveBeenCalledTimes(1)
    /**
     * 2 because we have subscribed to two container, and this will provide us
     * with two of those, hence two updates because two creations
     */
    expect(f2).toHaveBeenCalledTimes(1)
  })

  it("should send error if we remove a token some container listens to", async () => {
    const cb = vi.fn()
    const node = root.add(() => ({
      a: "A",
      b: "B",
    }))
    node.subscribeToContainer("a", (err) => {
      expect(err).not.toBe(null)
      cb()
    })
    node.delete("a")
    await wait(10)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it("should send error if we remove a token some containerSet listens to", async () => {
    const cb = vi.fn()
    const node = root.add(() => ({
      a: "A",
      b: "B",
    }))
    node.subscribeToContainerSet(["a", "b"], (err) => {
      expect(err).not.toBe(null)
      cb()
    })
    node.delete("a")
    await wait(10)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
