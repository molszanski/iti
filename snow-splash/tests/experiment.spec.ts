import { makeRoot } from "../src/library.new-root-container"

it.only("should test stuff", () => {
  // This is silly
  ;(async () => {
    let a = 12

    let r = makeRoot()
    let node = r.addValue("a", 12)

    console.log("node: ", node)
    console.log("a value: ", node.get("a"))

    let node2 = node.addValue("b", "b2")

    console.log("node2: ", node2)
    console.log("a node2 `b` token value: ", node2.get("b"))
    console.log("a node2 `a` token value: ", node2.get("a"))

    expect(a).toBe(12)
  })()
})
