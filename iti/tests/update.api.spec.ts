import { makeRoot } from "../src/library.new-root-container"

describe("Deleting and destructuring: ", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })
  it("should be able to store null", () => {
    let r = root.add({ a: "A", b: null })

    expect(r.get("a")).toBe("A")
    expect(r.get("b")).toBe(null)
  })

  it("should be able to upsert null and back", () => {
    let r = root.add({ a: "A", b: "B" })

    // normal state
    expect(r.get("a")).toBe("A")
    expect(r.get("b")).toBe("B")

    // upsert null
    r.upsert({ b: null })
    expect(r.get("b")).toBe(null)

    // tokens should be fine too
    expect(r.getTokens()).toMatchObject({ a: "a", b: "b" })

    // update B from null to a Primitive
    r.upsert({ b: "new B" })
    expect(r.get("b")).toBe("new B")
  }, 100)
})
