import { getMainMockAppContainer } from "./mocks/_mock-app-container"
import { wait } from "./_utils"

it("should get a single container", (cb) => {
  // This is silly
  ;(async () => {
    const cont = getMainMockAppContainer()

    expect(cont.containers).toHaveProperty("bCont")
    expect(cont.containers.aCont).toBeInstanceOf(Promise)

    let b = await cont.containers.bCont
    expect(b).toHaveProperty("b2")
    expect(b).toMatchSnapshot()
    cb()
  })()
})

it("should subscribe to a single container", (cb) => {
  // This is silly
  ;(async () => {
    const cont = getMainMockAppContainer()
    expect(cont.containers).toHaveProperty("bCont")
    expect(cont.containers.aCont).toBeInstanceOf(Promise)

    let m = jest.fn()
    cont.subscribeToContainer("cCont", m)
    let cCont = await cont.get("cCont")
    cCont.upgradeCContainer()

    let c = await cont.get("cCont")
    expect(m).toHaveBeenCalled()
    expect(c.c2.size).toBe(10)
    wait(20)
    cb()
  })()
})
