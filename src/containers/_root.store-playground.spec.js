import { getMainPizzaAppContainer } from "./_root.store"

it("lol", async () => {
  let a = 12

  const cont = getMainPizzaAppContainer()

  let auth = await cont.providerMap.auth()
  console.log("auth", auth)

  expect(a).toBe(12)
})
