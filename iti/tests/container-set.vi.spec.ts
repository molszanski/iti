import { describe, it, expect, beforeEach, vi } from "vitest"
import { createContainer } from "../src/iti"
import { getMainMockAppContainer } from "./mocks/_mock-app-container"
import { wait } from "./_utils"

// describe("Container set tests", () => {
//   let c0 = createContainer()
//   beforeEach(() => (c0 = createContainer()))

it("should get two containers that are async", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet(["aCont", "bCont"])

  expect(containerSet).toHaveProperty("aCont")
  expect(containerSet).toHaveProperty("bCont")
  expect(containerSet.bCont.b2).toMatchObject({ a1: {} })

  expect(containerSet).toMatchSnapshot(containerSet)
})

it("should subscribe to container set change", async () => {
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
})

it("should get container set via a new API", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet((c) => [c.aCont, c.bCont])

  expect(containerSet).toHaveProperty("aCont")
  expect(containerSet).toHaveProperty("bCont")
  expect(containerSet.bCont.b2).toMatchObject({ a1: {} })
  expect(containerSet).toMatchSnapshot(containerSet)
})

it("should subscribe to container set change via a new APi", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet((c) => [c.aCont, c.cCont])
  expect(containerSet).toHaveProperty("aCont")

  const a = vi.fn()
  cont.subscribeToContainerSet(
    (c) => {
      return [c.aCont, c.cCont]
    },
    (err, containerSet) => {
      expect(containerSet.cCont.c2.size).toBe(10)
      a()
    },
  )
  containerSet.cCont.upgradeCContainer()
  await wait(10)
  expect(a).toHaveBeenCalledTimes(2)
})

it("should subscribe to container set change via a old APi", async () => {
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
})

it("should be able to unsubscribe from container set change", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet((c) => [c.aCont, c.cCont])

  const fn = vi.fn()
  const unsub = cont.subscribeToContainerSet(
    (c) => [c.cCont],
    () => {
      fn()
      unsub()
    },
  )
  containerSet.cCont.upgradeCContainer()
  await wait(10)
  containerSet.cCont.upgradeCContainer()

  // Here we have two calls. And this should probably be double checked
  expect(fn).toHaveBeenCalledTimes(2)
})
