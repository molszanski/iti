import { getMainMockAppContainer } from "./mocks/_mock-app-container"

it("should get two containers that are async", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet(["aCont", "bCont"])

  expect(containerSet).toHaveProperty("aCont")
  expect(containerSet).toHaveProperty("bCont")
  expect(containerSet.bCont.b2).toMatchObject({ a1: {} })

  expect(containerSet).toMatchSnapshot(containerSet)
})

// it.only("should subscribe to container set change", async () => {
//   const cont = getMainMockAppContainer()
//   let containerSet = await cont.getContainerSet(["aCont", "bCont"])

//   expect(containerSet).toHaveProperty("aCont")
//   expect(containerSet).toHaveProperty("bCont")
//   expect(containerSet.bCont.b2).toMatchObject({ a1: {} })

//   expect(containerSet).toMatchSnapshot(containerSet)
// })
