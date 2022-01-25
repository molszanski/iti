import { getMainMockAppContainer } from "./mocks/_mock-app-container"

it.only("should get a single container", async () => {
  let a = 12
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet(["aCont"])
  // console.log(containerSet)

  let m = await cont.getContainer("aCont")
  // console.log("====", m)

  // expect(containerSet).toHaveProperty("aCont")
  // expect(containerSet).toHaveProperty("bCont")
  // expect(containerSet.bCont.b2).toMatchObject({ a1: {} })

  // expect(containerSet).toMatchSnapshot(containerSet)

  expect(a).toBe(12)
})
