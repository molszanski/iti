import { makeRoot } from "../src/library.new-root-container"

it.only("should test stuff", () => {
  // This is silly
  ;(async () => {
    let a = 12

    let r = makeRoot()

    let node1 = r
      .addNode({
        a: 123,
      })
      .addNode({ b: "123" })

    let node2 = node1.addNode({
      a: () => "updated lol",
      b: 2,
      c: 3,
    })
    // node2.get("")
    console.log("tok", node2.tokens())

    expect(a).toBe(12)
  })()
})
