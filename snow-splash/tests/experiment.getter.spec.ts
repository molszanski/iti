import { makeRoot } from "../src/library.new-root-container"

import { provideAContainer } from "./mocks/container.a"
import { provideBContainer } from "./mocks/container.b"
import { provideCContainer } from "./mocks/container.c"

describe.only("Node getter", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it("should return a value as a value", (cb) => {
    const node1 = root.addNode({
      aCont: async () => provideAContainer(),
    })
    const node2 = node1.addNode({
      bCont: async () => provideBContainer(await node1.get("aCont")),
    })

    ;(async () => {
      let b = await node2.get("bCont")
      expect(b).toHaveProperty("b2")
      cb()
    })()
  })

  it.only("should get nested conatainers", (cb) => {
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
      console.log(b)
      expect(b).toHaveProperty("b2")
      expect(b).toMatchSnapshot()

      cb()
    })()
  })
})
