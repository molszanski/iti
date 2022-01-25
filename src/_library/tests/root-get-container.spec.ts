import { getMainMockAppContainer } from "./mocks/_mock-app-container"

it("should get a single container", () => {
  // This is silly
  ;(async () => {
    const cont = getMainMockAppContainer()
    expect(cont.containers).toHaveProperty("bCont")
    expect(cont.containers.aCont).toBeInstanceOf(Promise)

    let b = await cont.containers.bCont
    expect(b).toHaveProperty("b2")
    expect(b).toMatchSnapshot()
  })()
})

it("should subscribe to a single container", (cb) => {
  // This is silly
  ;(async () => {
    const cont = getMainMockAppContainer()
    expect(cont.containers).toHaveProperty("bCont")
    expect(cont.containers.aCont).toBeInstanceOf(Promise)

    let cCont = await cont.containers.cCont
    cont.subscribeToContiner("cCont", (new_cCont) => {
      expect(new_cCont.c2.size).toBe(10)
      cb()
    })
    cCont.upgradeCContainer()
  })()
})
