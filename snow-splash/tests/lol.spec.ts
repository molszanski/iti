import { makeRoot } from "../src/library.new-root-container"

describe("Node getter", () => {
  it("should get nested conatainers", (cb) => {
    ;(async () => {
      const node1 = makeRoot().addNode({
        aCont: async () => 1,
      })

      cb()
    })()
  })
})
