import { makeRoot } from "../src/iti"
function printTokenValue(token, value) {
  console.log(`Token: ${token}  | ${value}  -- of ${typeof value}`)
}
describe("Node.get()", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it("should return a value as a value", async () => {
    const node = root.add({
      a: 123,
    })
    expect(node.get("a")).toBe(123)
  })

  it("should throw if a token is missing", async () => {
    const node = root.add({
      a: 123,
    })
    expect(() => {
      // @ts-expect-error
      node.get("c")
    }).toThrowError()
  })

  it("should return function result and not a function", async () => {
    const node = root.add({
      functionTOken: () => "optimus",
    })
    expect(node.get("functionTOken")).toBe("optimus")
  })
  it("should return correct tokens for merged and overriden nodes", () => {
    const node = root
      .add({
        optimus: () => "prime",
        a: 123,
      })
      .upsert({
        a: "123",
      })
    expect(node.getTokens()).toMatchObject({
      optimus: "optimus",
      a: "a",
    })
  })

  it("should return cached value of a function", async () => {
    let fn = jest.fn()
    const node = root.add({
      optimus: () => {
        fn()
        return "prime"
      },
    })
    node.get("optimus")
    node.get("optimus")
    expect(node.get("optimus")).toBe("prime")
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should return promises of async functions", (cb) => {
    ;(async () => {
      const node = root.add({
        optimus: async () => "prime",
      })
      expect(await node.get("optimus")).toBe("prime")
      cb()
    })()
  })

  it("should handle async errors with a simple try/catch", (cb) => {
    ;(async () => {
      const node = root
        .add({
          optimus: async () => "prime",
          megatron: async () => {
            throw "all hail megatron"
          },
        })
        .add((ctx) => ({
          decepticons: async () => {
            leader: await ctx.megatron
          },
        }))

      expect(await node.get("optimus")).toBe("prime")
      try {
        await node.get("megatron")
      } catch (e) {
        expect(e).toBe("all hail megatron")
      }

      try {
        await node.containers.decepticons
      } catch (e) {
        expect(e).toBe("all hail megatron")
        cb()
      }
    })()
  })

  it("should handle async errors with for getContainerSet", (cb) => {
    ;(async () => {
      const node = root
        .add({
          optimus: async () => "prime",
          megatron: async () => {
            throw "all hail megatron"
          },
        })
        .add((ctx) => ({
          decepticons: async () => {
            leader: await ctx.megatron
          },
        }))

      try {
        await node.getContainerSet(["optimus", "decepticons"])
      } catch (e) {
        expect(e).toBe("all hail megatron")
        cb()
      }
    })()
  })

  it("should call container provider once, but container token twice", () => {
    const fn1 = jest.fn()
    const fn2 = jest.fn()

    const node = root.add({
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

    let a1 = node.get("autobots")
    a1.optimus()
    let a2 = node.get("autobots")
    a2.optimus()
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(2)
  })
})
