import _ from "lodash"
import { AppContainer } from "../containers/_root.store"

console.log(123)

async function runStuff() {
  let a = new AppContainer()

  let l = a.getBetterKeys()

  console.log(l)

  let k = await l.auth()
  console.log(k)

  let k2 = await l.aCont()
  console.log(k2)

  let k3 = await l.bCont()
  console.log(k3)
}

runStuff().then(() => {
  console.log("done")
})

// async function runStuff() {
//   let a = new AppContainer()

//   let k = await a.getKitchenContainer()
//   let pp = await a.getPizzaPlaceContainer()

//   pp.diningTables.addNewTable()
//   pp.diningTables.addNewTable()
//   pp.diningTables.addNewTable()

//   k.orderManager.orderPizza(pp.diningTables.tables[1])
//   k.orderManager.orderPizza(pp.diningTables.tables[2])

//   console.log(k.orderManager.orders)
//   k.orderManager.orders.forEach((order) => {
//     console.log(order.pizza.state)
//     console.log(JSON.stringify(order.pizza.ingredients))
//   })
// }

// runStuff().then(() => {
//   console.log("done")
// })
