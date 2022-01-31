import { getMainMockAppContainer } from "./mocks/_mock-app-container"
import { expectType, expectError, printType, expectNotType } from "tsd"
import { A_Container } from "./mocks/container.a"
import { B_Container } from "./mocks/container.b"

it("should get two containers that are async", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet(["aCont", "bCont"])

  expect(containerSet).toHaveProperty("aCont")
  expect(containerSet).toHaveProperty("bCont")
  expect(containerSet.bCont.b2).toMatchObject({ a1: {} })

  expect(containerSet).toMatchSnapshot(containerSet)
})

it("should check token types", () => {
  const cont = getMainMockAppContainer()
  expectType<("aCont" | "bCont" | "cCont")[]>(cont.tokens)
})

it("should check getContainerSet types", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet(["aCont", "bCont"])
  expectNotType<any>(containerSet)
  expectNotType<any>(containerSet.aCont)
  expectType<A_Container>(containerSet.aCont)
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

it("should get container set via a new API", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSetNew((c) => [c.aCont, c.bCont])

    expect(containerSet).toHaveProperty("aCont")
    expect(containerSet).toHaveProperty("bCont")
    expect(containerSet.bCont.b2).toMatchObject({ a1: {} })
    expect(containerSet).toMatchSnapshot(containerSet)

    // test types
    expectNotType<any>(containerSet)
    expectNotType<any>(containerSet.aCont)
    expectType<A_Container>(containerSet.aCont)

    cb()
  })()
})

it("should check containerSet type", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSetNew((c) => [c.aCont, c.bCont])

  // test types
  expectNotType<any>(containerSet)
  expectNotType<any>(containerSet.aCont)
  expectType<A_Container>(containerSet.aCont)
})

it("should subscribe to container set change via a new APi", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSetNew((c) => [c.aCont, c.cCont])
    expect(containerSet).toHaveProperty("aCont")

    containerSet.cCont.upgradeCContainer()
    cont.subscribeToContinerSetNew(
      (c) => {
        expectNotType<any>(c)
        expectType<"aCont">(c.aCont)
        return [c.aCont, c.cCont]
      },
      (containerSet) => {
        expect(containerSet.cCont.c2.size).toBe(10)
        cb()
      },
    )
  })()
})

it("should be able to unsubscribe from container set change", (cb) => {
  ;(async () => {
    const cont = getMainMockAppContainer()
    let containerSet = await cont.getContainerSetNew((c) => [c.aCont, c.cCont])

    const fn = jest.fn()
    containerSet.cCont.upgradeCContainer()
    const unsub = cont.subscribeToContinerSetNew(
      (c) => [c.cCont],
      () => {
        unsub()
        fn()
        containerSet.cCont.upgradeCContainer()
        cont.subscribeToContinerSetNew(
          (c) => [c.cCont],
          () => {
            expect(fn).toHaveBeenCalledTimes(1)
            cb()
          },
        )
      },
    )
  })()
})
