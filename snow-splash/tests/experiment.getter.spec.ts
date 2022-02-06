import { makeRoot } from "../src/library.new-root-container"

it("test", () => {})
export const a = 1
import { provideAContainer } from "./mocks/container.a"
import { provideBContainer } from "./mocks/container.b"
import { provideCContainer } from "./mocks/container.c"

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

  it("should be able to chain multiple nodes", () => {
    let r = root
      .addNode({ a: "A" })
      .addNode({ b: "B" })
      .addNode({ c: "C" })
      .addNode({ d: "D" })

    expect(r.get("a")).toBe("A")
    expect(r.get("c")).toBe("C")
  })

  it("should accept callback function that provides current node", () => {
    let r = root
      .addNode({ a: "A" })
      .addNode({ k: "A" })
      .addSuperNode((c) => {
        expect(c.get("a")).toBe("A")
        return { b: "B", c: "C" }
      })
      .addSuperNode((c) => {
        expect(c.get("b")).toBe("B")
        return { f: "F", g: "G" }
      })

    expect(r.get("f")).toBe("F")
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
        .seal()

      expect(node.get("f")).toBe(UniqueResult.F)
      // @ts-expect-error
      let a: UniqueResult.A = node.get("f")
      cb()
    })()
  })

  it("should test long chain", () => {
    let r = root
      .addNode({ a: "A" })
      .addNode({ k: "A" })
      .addSuperNode((c) => {
        expect(c.get("a")).toBe("A")
        return { b: "B", c: "C" }
      })
      .addSuperNode((c) => {
        expect(c.get("b")).toBe("B")
        return { f: "F", g: "G" }
      })

    expect(r.get("f")).toBe("F")
    expect(r.get("a")).toBe("A")

    r.addNode({ a: "new A" })
    expect(r.get("a")).toBe("new A")
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
        .seal()

      let r = node.get("a") + node.get("c") + node.get("d")
      expect(r).toBe("ACD")

      cb()
    })()
  })

  it.skip("should handle async node with out of order execution", (cb) => {
    ;(async () => {
      let node = await root
        .addPromise(async (c) => {
          return {
            c: () => "C",
          }
        })
        .addPromise(async (c) => {
          // this will throw
          c.get("c")
          return {
            d: () => "D",
          }
        })
        .seal()

      let r = node.get("c") + node.get("d")
      expect(r).toBe("ACD")

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
