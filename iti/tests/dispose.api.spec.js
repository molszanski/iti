import { makeRoot } from "../src"

describe("Disposing: ", () => {
  let root

  beforeEach(() => {
    root = makeRoot()
  })
  it.only("should be able to call dispose", (cb) => {
    ;(async () => {
      let r = root
        .add({ mf: "Swet JIZSA", bc: null })
        .add({ a: "A", b: null })
        .addDisposer((ctx) => ({
          a: () => {
            console.log("disposing a", ctx.a)
          },
          b: () => {
            console.log("disposing a", ctx.a)
          },
        }))

      const test = () => {
        console.log("testp,")
      }
      const a = await Promise.all([r.get("a"), r.get("b"), test()])

      expect(r.get("a")).toBe("A")
      cb()
    })()
  })
})
