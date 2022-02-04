import { makeRoot } from "../src/library.new-root-container"

it("should return correct tokens", () => {
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

it("should test stuff", () => {
  let a = 12

  let r = makeRoot()

  let node1 = r.addNode({
    aPrime: () => "optimus",
    a: 123,
  })

  let node2 = node1.addNode({
    a: () => "updated lol",
    b: 2,
    c: 3,
  })
  let a1 = node2.get("a")
  console.log("token: ", a, "| type", typeof a1)
  expect(node2.getTokens()).toMatchObject({
    a: "a",
    b: "b",
    c: "c",
    aPrime: "aPrime",
  })

  expect(a).toBe(12)
})

// it("should asunc stuff", () => {
//   // This is silly
//   ;(async () => {
//     let a = 12

//     expect(a).toBe(12)
//   })()
// })
