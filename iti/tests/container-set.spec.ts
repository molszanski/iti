import { getMainMockAppContainer } from "./mocks/_mock-app-container"
import { wait } from "./_utils"

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
    cont.subscribeToContainerSet(
      ["aCont", "bCont", "cCont"],
      (err, containerSet) => {
        expect(containerSet.cCont.c2.size).toBe(10)
      },
    )
    await cont.get("cCont")
    await wait(10)
    cb()
  })()
})

it("should get container set via a new API", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSet((c) => [c.aCont, c.bCont])

    expect(containerSet).toHaveProperty("aCont")
    expect(containerSet).toHaveProperty("bCont")
    expect(containerSet.bCont.b2).toMatchObject({ a1: {} })
    expect(containerSet).toMatchSnapshot(containerSet)

    cb()
  })()
})

// !!!!!s
it("should subscribe to container set change via a new APi", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSet((c) => [c.aCont, c.cCont])
    expect(containerSet).toHaveProperty("aCont")

    cont.subscribeToContainerSet(
      (c) => {
        return [c.aCont, c.cCont]
      },
      (err, containerSet) => {
        expect(containerSet.cCont.c2.size).toBe(10)
      },
    )
    containerSet.cCont.upgradeCContainer()
    await wait(10)
    cb()
  })()
})

it("should subscribe to container set change via a old APi", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSet(["aCont", "cCont"])
    expect(containerSet).toHaveProperty("aCont")

    cont.subscribeToContainerSet(
      (c) => {
        return [c.aCont, c.cCont]
      },
      (err, containerSet) => {
        expect(containerSet.cCont.c2.size).toBe(10)
      },
    )

    containerSet.cCont.upgradeCContainer()
    await wait(10)
    cb()
  })()
})

it("should be able to unsubscribe from container set change", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSet((c) => [c.aCont, c.cCont])

    const fn = jest.fn()

    const unsub = cont.subscribeToContainerSet(
      (c) => [c.cCont],
      () => {
        unsub()
        fn()

        cont.subscribeToContainerSet(
          (c) => [c.cCont],
          () => {
            // TODO: well this should be an error probably
            expect(fn).toHaveBeenCalledTimes(2)
          },
        )
        containerSet.cCont.upgradeCContainer()
        wait(10).then(() => cb())
      },
    )
    containerSet.cCont.upgradeCContainer()
  })()
})
