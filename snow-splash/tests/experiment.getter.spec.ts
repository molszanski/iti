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
