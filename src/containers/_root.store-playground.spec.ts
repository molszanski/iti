import _ from "lodash"
import { getMainPizzaAppContainer } from "./_root.store"

it.only("lol", async () => {
  let a = 12

  const cont = getMainPizzaAppContainer()

  let m = await cont.getContainerSet(["aCont", "bCont", "auth"])
  console.log("~~~!!!", m)

  expect(a).toBe(12)
})
