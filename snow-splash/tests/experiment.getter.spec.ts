import { makeRoot } from "../src/library.new-root-container"

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

    let f = root.addNode({ a: "A" }).addNode({ k: "A" }).addNode({ m: "A" })
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

  // it.only("should test long chain", () => {
  //   let r = root
  //     .addNode({ a: "A" })
  //     .addNode({ k: "A" })
  //     .addSuperNode((c) => {
  //       expect(c.get("a")).toBe("A")
  //       return { b: "B", c: "C" }
  //     })
  //     .addSuperNode((c) => {
  //       expect(c.get("b")).toBe("B")
  //       return { f: "F", g: "G" }
  //     })

  //   expect(r.get("f")).toBe("F")

  //   // @ts-ignore
  //   console.log("a ~~> ", r.get("a"))
  //   console.log("lol", r)
  // })
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
  })

  it("should get container set of only resolved promises", async () => {
    await expect(node.getContainerSet(["c", "d"])).resolves.toMatchObject({
      c: "C",
      d: "D",
    })
  })

  it("should get container set based literals and resolved promises", async () => {
    await expect(node.getContainerSet(["a", "c"])).resolves.toMatchObject({
      a: "A",
      c: "C",
    })
  })
})
