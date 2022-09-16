import { makeRoot } from "../src/library.new-root-container"
import { wait } from "./_utils"

describe("Deleting and destructuring: ", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
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
  }, 100)

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

  it("should send containerUpdated event on overwrite", (cb) => {
    ;(async () => {
      root.on("containerDeleted", (k) => {
        expect(k.key).toBe("b")
        root.on("containerUpserted", (k) => {
          expect(k.key).toBe("b")
          expect(k.newContainer).toBe("new B")
          cb()
        })
        root.upsert({ b: "new B" })
      })

      root.add({ a: "A", b: "B" }).delete("b")
    })()
  }, 100)

  it.only("should send containerUpdated event on overwrite", (cb) => {
    ;(async () => {
      const node = root.add(() => ({
        a: "A",
        b: "B",
      }))
      let f1 = jest.fn()
      let f2 = jest.fn()

      node.subscribeToContiner("a", f1)
      node.subscribeToContinerSet(["a", "b"], f2)

      node.delete("a")

      await wait(10)

      expect(f1).toHaveBeenCalledTimes(1)
      /**
       * 2 becaus we have subscribed to two container, and this will provide us
       * with two of those, hence two updates because two creations
       */
      expect(f2).toHaveBeenCalledTimes(2)
      cb()
    })()
  }, 100)
})
