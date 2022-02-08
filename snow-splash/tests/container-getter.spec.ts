import { getMainMockAppContainer } from "./mocks/_mock-app-container"

it("should get a single container", (cb) => {
  // This is silly
  ;(async () => {
    const cont = getMainMockAppContainer()

    console.log("cont", cont.containers)
    expect(cont.containers).toHaveProperty("bCont")
    expect(cont.containers.aCont).toBeInstanceOf(Promise)

    console.log("cont", cont)
    let b = await cont.containers.bCont
    expect(b).toHaveProperty("b2")
    expect(b).toMatchSnapshot()
    cb()
  })()
})

// it("should subscribe to a single container", (cb) => {
//   // This is silly
//   ;(async () => {
//     const cont = getMainMockAppContainer()
//     expect(cont.containers).toHaveProperty("bCont")
//     expect(cont.containers.aCont).toBeInstanceOf(Promise)

//     let cCont = await cont.get
//     cont.subscribeToContiner("cCont", (new_cCont) => {
//       expect(new_cCont.c2.size).toBe(10)
//       cb()
//     })
//     cCont.upgradeCContainer()
//   })()
// })
