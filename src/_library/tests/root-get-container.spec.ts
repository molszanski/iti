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

it.only("should subscribe to a single container", () => {
  // This is silly
  ;(async () => {
    const cont = getMainMockAppContainer()
    expect(cont.containers).toHaveProperty("bCont")
  })()
})
