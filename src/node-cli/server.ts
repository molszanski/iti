import { AppContainer } from "../containers/_root.store"

console.log(123)

async function runStuff() {
  let a = new AppContainer()

  let k = await a.getKitchenContainer()
  let pp = await a.getPizzaPlaceContainer()

  pp.diningTables.addNewTable()
  pp.diningTables.addNewTable()
  pp.diningTables.addNewTable()

  let randomTable = pp.diningTables.tables[1]
  k.orderManager.orderPizza(randomTable)
}

runStuff().then(() => {
  console.log("done")
})
