import { makeRoot } from "../src/library.new-root-container"
function printTokenValue(token, value) {
  console.log(`Token: ${token}  | ${value}  -- of ${typeof value}`)
}
describe("Node.get()", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it("should return a value as a value", () => {
    let node = root.addNode({
      a: 123,
    })
    expect(node.get("a")).toBe(123)
  })
  it("should return function result and not a function", () => {
    let node = root.addNode({
      functionTOken: () => "optimus",
    })
    expect(node.get("functionTOken")).toBe("optimus")
  })
  it("should return correct tokens for merged and overriden nodes", () => {
    let node = root
      .addNode({
        optimus: () => "prime",
        a: 123,
      })
      .addNode({
        a: "123",
      })
    expect(node.getTokens()).toMatchObject({
      optimus: "optimus",
      a: "a",
    })
  })

  it("should return cached value of a function", () => {
    let node = makeRoot().addNode({
      optimus: () => "prime",
    })
    expect(node.get("optimus")).toBe("prime")
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
