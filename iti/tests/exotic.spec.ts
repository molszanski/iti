import { createContainer } from "../src/iti"
import { wait } from "./_utils"

describe("Perf and exotic tests:", () => {
  let root = createContainer()

  beforeEach(() => {
    root = createContainer()
  })

  describe("Node get:", () => {
    it("should not run into an infinite loop with recursive search", (cb) => {
      ;(async () => {
        let r = root
          .add((c) => ({ a: async () => "A", b: "B", c: "C" }))
          .add((c, node) => ({
            d: async () => {
              expect(await node.containers.b).toBe("B")
              return "D"
            },
          }))
          .upsert((c) => ({
            d: async () => {
              expect(await c.b).toBe("B")
              return "D"
            },
          }))
        expect(await r.containers.d).toBe("D")
        cb()
      })()
    }, 100)

    it("should never evaluate unrequested tokens, but pass correct refence to child node ", (cb) => {
      ;(async () => {
        let r = root
          .add((c) => ({
            b: async () => {
              throw new Error()
              return { x: "x", y: "y" }
            },
            c: "C",
          }))
          .add((c) => {
            return {
              d: async () => {
                expect(c.c).toBe("C")
                return "D"
              },
            }
          })
        let a = r.get("d")
        expect(await r.containers.d).toBe("D")
        cb()
      })()
    }, 100)

    // getTokens must be async welp
    it("should never evaluate unrequested tokens, but pass correct refence to child node \
            without a manual seal", (cb) => {
      ;(async () => {
        let r = root
          .add((c) => ({
            b: async () => {
              throw new Error()
              return { x: "x", y: "y" }
            },
            c: "C",
          }))
          .add((c, node) => {
            return {
              d: async () => {
                expect(await node.containers.c).toBe("C")
                return "D"
              },
            }
          })

        expect(await r.containers.d).toBe("D")
        cb()
      })()
    }, 100)
  })
})
