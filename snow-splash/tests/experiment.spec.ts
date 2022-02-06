import { makeRoot } from "../src/library.new-root-container"
function printTokenValue(token, value) {
  console.log(`Token: ${token}  | ${value}  -- of ${typeof value}`)
}
describe.only("Node.get()", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it("should return a value as a value", async () => {
    const node = root.addNode({
      a: 123,
    })
    await expect(node.get("a")).resolves.toBe(123)
  })
  it("should return function result and not a function", async () => {
    const node = root.addNode({
      functionTOken: () => "optimus",
    })
    await expect(node.get("functionTOken")).resolves.toBe("optimus")
  })
  it("should return correct tokens for merged and overriden nodes", () => {
    const node = root
      .addNode({
        optimus: () => "prime",
        a: 123,
      })
      .addNode({
        a: "123",
      })
    expect(node.getTokens()).toMatchObject({
      optimus: "optimus",
      a: "a",
    })
  })

  it("should return cached value of a function", async () => {
    const node = root.addNode({
      optimus: () => "prime",
    })
    await expect(node.get("optimus")).resolves.toBe("prime")
  })

  it("should return promises of async functions", (cb) => {
    ;(async () => {
      const node = root.addNode({
        optimus: async () => "prime",
      })
      expect(await node.get("optimus")).toBe("prime")
      cb()
    })()
  })

  it("should call container provider once, but container token twice", (cb) => {
    ;(async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()

      const node = root.addNode({
        autobots: () => {
          fn1()
          return {
            optimus: () => {
              fn2()
              return "autobots assemble"
            },
            bumblebee: "bumblebee",
            jazz: "jazz",
          }
        },
      })
      expect(fn1).not.toBeCalled()
      expect(fn2).not.toBeCalled()

      let a1 = await node.get("autobots")
      a1.optimus()
      let a2 = await node.get("autobots")
      a2.optimus()
      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).toHaveBeenCalledTimes(2)
      cb()
    })()
  })
})
