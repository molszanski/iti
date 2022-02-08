import { makeRoot } from "../src/library.new-root-container"
import { wait } from "../src/_utils"

describe("Perf and exotic tests:", () => {
  let root = makeRoot()

  beforeEach(() => {
    root = makeRoot()
  })

  describe("Node get:", () => {
    it("should not run into an infinite loop with recursive search", (cb) => {
      ;(async () => {
        let r = await root
          .addPromise(async (c) => ({ b: "B", c: "C" }))
          .addPromise(async (c) => {
            expect(await c.containers.b).toBe("B")
            return { d: "D" }
          })
          .seal()
        expect(await r.containers.d).toBe("D")
        cb()
      })()
    }, 100)

    it("should never evaluate unrequested tokens, but pass correct refence to child node ", (cb) => {
      ;(async () => {
        let r = await root
          .addPromise(async (c) => ({
            b: async () => {
              throw new Error()
              return { x: "x", y: "y" }
            },
            c: "C",
          }))
          .addPromise(async (c) => {
            return {
              d: async () => {
                expect(await c.containers.c).toBe("C")
                return "D"
              },
            }
          })
          .seal()
        expect(await r.containers.d).toBe("D")
        cb()
      })()
    }, 100)

    // getTokens must be async welp
    it.skip("ERR: should never evaluate unrequested tokens, but pass correct refence to child node \
          without a manual seal", (cb) => {
      ;(async () => {
        let r = root
          .addPromise(async (c) => ({
            b: async () => {
              throw new Error()
              return { x: "x", y: "y" }
            },
            c: "C",
          }))
          .addPromise(async (c) => {
            return {
              d: async () => {
                expect(await c.containers.c).toBe("C")
                return "D"
              },
            }
          })

        // THIS TEST IS SKIPPED AND FAILS because we MUST
        // update everything including get tokens to async
        expect(await r.containers.d).toBe("D")
        console.log("m", await r.containers)
        cb()
      })()
    }, 100)
  })
})
