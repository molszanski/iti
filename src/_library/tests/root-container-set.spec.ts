import { getMainMockAppContainer } from "./mocks/_mock-app-container"

it("should get two containers that are async", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet(["aCont", "bCont"])

  expect(containerSet).toHaveProperty("aCont")
  expect(containerSet).toHaveProperty("bCont")
  expect(containerSet.bCont.b2).toMatchObject({ a1: {} })

  expect(containerSet).toMatchSnapshot(containerSet)
})

it("should subscribe to container set change", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSet(["aCont", "bCont", "cCont"])

    expect(containerSet).toHaveProperty("aCont")
    expect(containerSet).toHaveProperty("bCont")
    expect(containerSet.bCont.b2).toMatchObject({ a1: {} })
    expect(containerSet.cCont.c2.size).toBe(5)

    containerSet.cCont.upgradeCContainer()
    cont.subscribeToContinerSet(["aCont", "bCont", "cCont"], (containerSet) => {
      expect(containerSet.cCont.c2.size).toBe(10)
      cb()
    })
  })()
})

it.only("should get container set via a new API", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSetNew((c) => [c.aCont, c.bCont])

    expect(containerSet).toHaveProperty("aCont")
    expect(containerSet).toHaveProperty("bCont")
    expect(containerSet.bCont.b2).toMatchObject({ a1: {} })

    expect(containerSet).toMatchSnapshot(containerSet)

    cb()
  })()
})

it.skip("should be able to unsubscribe from container set change", (cb) => {})
