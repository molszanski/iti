import { makeRoot } from "../src/library.new-root-container"
function printTokenValue(token, value) {
  console.log(`Token: ${token}  | ${value}  -- of ${typeof value}`)
}
describe("Node.get()", () => {
  it("should return function result and not a function", () => {
    let node = makeRoot().addNode({
      functionTOken: () => "optimus",
    })

    expect(node.get("functionTOken")).toBe("optimus")
  })
})
it("should return correct tokens for an overriden node container token", () => {
  let node1 = makeRoot().addNode({
    aPrime: () => "optimus",
    a: 123,
  })
  let node2 = node1.addNode({
    a: () => "updated lol",
    b: 2,
    c: 3,
  })
  expect(node2.getTokens()).toMatchObject({
    a: "a",
    b: "b",
    c: "c",
    aPrime: "aPrime",
  })
})

it("should resolve async stuff", (cb) => {
  // This is silly
  ;(async () => {
    let a = 12

    let r = makeRoot()

    let node1 = r.addNode({
      aPrime: () => "optimus",
      a: 123,
      f: async () => {
        console.log("calling me")
        return {
          data: 123,
          newData: () => {
            console.log("calling me every time")
            return "123"
          },
        }
      },
    })

    let z = node1.get("aPrime")
    printTokenValue("aPrime", z)

    let m = await node1.get("f")
    printTokenValue("f", m)

    let m2 = await node1.get("f")
    printTokenValue("f", m2)
    let nd = m2.newData()
    let nd2 = m2.newData()

    expect(a).toBe(12)
    cb()
  })()
})
