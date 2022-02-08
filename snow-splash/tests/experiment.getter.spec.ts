import { makeRoot } from "../src/library.new-root-container"
import { wait } from "../src/_utils"

import { provideAContainer } from "./mocks/container.a"
import { provideBContainer } from "./mocks/container.b"
import { provideCContainer } from "./mocks/container.c"

describe("Node long chain async", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it("should test long chain", (cb) => {
    ;(async () => {
      let r = await root
        .addNode({ a: "A" })
        .addNode({ k: "A" })
        .addPromise(async (c) => {
          await expect(c.get("a")).resolves.toBe("A")
          return { b: "B", c: "C" }
        })
        .addPromise(async (c) => {
          await expect(c.get("a")).resolves.toBe("A")
          return { b: "B", c: "C" }
        })
        .addPromise(async (c) => {
          await expect(c.get("a")).resolves.toBe("A")
          await expect(c.get("b")).resolves.toBe("B")
          return { f: "F", g: "G" }
        })
        .seal()

      await expect(r.get("f")).resolves.toBe("F")
      await expect(r.get("a")).resolves.toBe("A")

      r.addNode({ a: "new A" })
      await expect(r.get("a")).resolves.toBe("new A")
      cb()
    })()
  }, 100)
  it.todo("should test if I can overwrite token")
  it.todo("should test if I can overwrite token and request it inside node")
  it.todo(
    "should test overrides for async long chains, because of cached values",
  )
})

describe("Node subscribeToContiner", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it("should subscribe to async container creation", (cb) => {
    const node = root.addPromise(async () => ({
      a: async () => "A",
      b: async () => "B",
    }))
    node.subscribeToContiner("a", async (container) => {
      expect(await container).toBe("A")
      cb()
    })
    node.get("a")
  })

  it("should not fire an event on a sync node", (cb) => {
    ;(async () => {
      const node = root.addNode({
        a: async () => "A",
        b: "B",
      })
      let f1 = jest.fn()
      let f2 = jest.fn()
      node.subscribeToContiner("a", f1)
      node.subscribeToContiner("b", f2)

      await node.get("a")
      await node.get("b")
      expect(f1).toBeCalled()
      expect(f2).not.toBeCalled()
      cb()
    })()
  })

  it("should use containerSet to subscribe to events", (cb) => {
    ;(async () => {
      const node = await root
        .addPromise(async () => ({
          a: async () => "A",
          b: "B",
        }))
        .addPromise(async () => ({
          c: async () => "C",
          d: "D",
        }))
        .seal()
      // await node.get("a")
      let f1 = jest.fn()
      let f2 = jest.fn()
      let f3 = jest.fn()
      let f4 = jest.fn()

      node.subscribeToContinerSet(["a", "c"], f1)
      node.subscribeToContinerSet(["c", "d"], f2)
      // TODO: Warning, if called before seal, this will fail
      node.subscribeToContinerSet((c) => [c.a, c.c], f3)
      node.subscribeToContinerSet((c) => [c.c, c.d], f4)
      await node.get("c")
      await node.get("c")
      await node.get("c")
      await node.get("b")
      await node.get("a")
      // await node.get((c)=> c.a)
      /**
       * 2 becaus we have subscribed to two container, and this will provide us
       * with two of those, hence two updates because two creations
       */
      expect(f1).toHaveBeenCalledTimes(2)
      // One because D is stored as a value on seal creation
      expect(f2).toHaveBeenCalledTimes(1)
      expect(f3).toHaveBeenCalledTimes(2)
      expect(f4).toHaveBeenCalledTimes(1)
      cb()
    })()
  })
})

describe("Node getter", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it("should get nested conatainers", (cb) => {
    ;(async () => {
      const node1 = root.addNode({
        aCont: async () => provideAContainer(),
      })
      const node2 = node1.addNode({
        bCont: async () => provideBContainer(await node1.get("aCont")),
      })
      const containers = node2.containers

      expect(containers).toHaveProperty("bCont")
      expect(containers.aCont).toBeInstanceOf(Promise)

      let b = await containers.bCont
      expect(b).toHaveProperty("b2")
      expect(b).toMatchSnapshot()

      cb()
    })()
  })
})

describe("Node addNode", () => {
  let root: ReturnType<typeof makeRoot>
  let node = mockNode()

  function mockNode() {
    return makeRoot().addNode({
      a: "A",
      b: () => "B",
      c: async () => "C",
      d: async () => "D",
    })
  }
  beforeEach(() => {
    root = makeRoot()
    node = mockNode()
  })

  it("should be able to chain multiple nodes", async () => {
    let r = root
      .addNode({ a: "A" })
      .addNode({ b: "B" })
      .addNode({ c: "C" })
      .addNode({ d: "D" })

    await expect(r.get("a")).resolves.toBe("A")
    await expect(r.get("c")).resolves.toBe("C")
  })

  it("should accept callback function that provides current node", async () => {
    let r = await root
      .addNode({ a: "A" })
      .addNode({ k: "A" })
      .addPromise(async (c) => {
        await expect(c.get("a")).resolves.toBe("A")
        return { b: "B", c: "C" }
      })
      .addPromise(async (c) => {
        let m = await c.get("b")
        await expect(c.get("b")).resolves.toBe("B")
        return { f: "F", g: "G" }
      })
    await expect(r.get("f")).resolves.toBe("F")
  })

  it("should be able to add an async node", (cb) => {
    // We need to test if typescript throws a type error here
    enum UniqueResult {
      A,
      B,
      F,
    }
    ;(async () => {
      let node = await root
        .addNode({
          a: UniqueResult.A,
          b: () => UniqueResult.B,
        })
        .addPromise(async () => ({
          f: () => UniqueResult.F,
        }))

      await expect(node.get("f")).resolves.toBe(UniqueResult.F)
      // @ts-expect-error
      let a: UniqueResult.A = await node.get("f")
      cb()
    })()
  })

  it("should test long chain", async () => {
    let r = root
      .addNode({ a: "A" })
      .addNode({ k: "A" })
      .addPromise(async (c) => {
        await expect(c.get("a")).resolves.toBe("A")
        return { b: "B", c: "C" }
      })
      .addPromise(async (c) => {
        await expect(c.get("b")).resolves.toBe("B")
        return { f: "F", g: "G" }
      })

    // await expect(r.get("f")).resolves.toBe("F")
    await expect(r.get("a")).resolves.toBe("A")

    r.addNode({ a: "new A" })
    await expect(r.get("a")).resolves.toBe("new A")
  })

  it("should be able to add an async with a callback pattern", (cb) => {
    ;(async () => {
      let node = await root
        .addNode({
          a: "A",
          b: () => "B",
        })
        .addPromise(async (c) => {
          return {
            c: () => "C",
          }
        })
        .addPromise(async (c) => {
          return {
            d: () => "D",
          }
        })

      let r =
        (await node.get("a")) + (await node.get("c")) + (await node.get("d"))
      expect(r).toBe("ACD")

      cb()
    })()
  })

  it("should handle async node with out of order execution", (cb) => {
    ;(async () => {
      let node = await root
        .addNode((c) => {
          return {
            a: () => "A",
            b: () => "B",
          }
        })
        .addPromise(async (c) => {
          return {
            c: () => "C",
          }
        })
        .addPromise(async (c) => {
          let c2 = await c.get("c")
          return {
            d: () => "D",
            cd: () => c2 + "D",
          }
        })

      let r =
        (await node.get("a")) + (await node.get("c")) + (await node.get("d"))
      expect(r).toBe("ACD")
      let r2 = (await node.get("b")) + (await node.get("cd"))
      expect(r2).toBe("BCD")

      cb()
    })()
  }, 100)
})

describe("Node getContainerSet", () => {
  let root: ReturnType<typeof makeRoot>
  let node = mockNode()

  function mockNode() {
    return makeRoot().addNode({
      a: "A",
      b: () => "B",
      c: async () => "C",
      d: async () => "D",
    })
  }
  beforeEach(() => {
    root = makeRoot()
    node = mockNode()
  })

  it("should get container set based of primitive values", async () => {
    await expect(node.getContainerSet(["a", "b"])).resolves.toMatchObject({
      a: "A",
      b: "B",
    })
    await expect(
      node.getContainerSet((c) => [c.a, c.b]),
    ).resolves.toMatchObject({
      a: "A",
      b: "B",
    })
  })

  it("should get container set of only resolved promises", async () => {
    await expect(node.getContainerSet(["c", "d"])).resolves.toMatchObject({
      c: "C",
      d: "D",
    })

    await expect(
      node.getContainerSet((c) => [c.c, c.d]),
    ).resolves.toMatchObject({
      c: "C",
      d: "D",
    })
  })

  it("should get container set based literals and resolved promises", async () => {
    await expect(node.getContainerSet(["a", "c"])).resolves.toMatchObject({
      a: "A",
      c: "C",
    })

    await expect(
      node.getContainerSet((c) => [c.a, c.c]),
    ).resolves.toMatchObject({
      a: "A",
      c: "C",
    })
  })

  it("should get container set via callback API", async () => {
    await expect(
      node.getContainerSet((c) => [c.a, c.c]),
    ).resolves.toMatchObject({
      a: "A",
      c: "C",
    })
  }, 100)
})
