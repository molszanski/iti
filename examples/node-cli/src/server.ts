import _ from "lodash"
import { RootContainer, wait } from "snow-splash"

// Your application logic is clean
class Oven {
  public pizzasInOven() {
    return 3
  }
  public async preheat() {}
}
class Kitchen {
  constructor(public oven: Oven) {}
}

// Step 2: Connect your app to container and define tokens
const ovenContainer = async () => ({
  oven: new Oven(),
})
const kitchenContainer = async ({ oven }) => {
  await oven.preheat()
  return {
    kitchen: new Kitchen(oven),
  }
}
const kitchenApp = new RootContainer((ctx) => ({
  // you can use tokens (`oven`, `kitchen`) here and later on
  oven: async () => ovenContainer(),
  kitchen: async () => kitchenContainer(await ctx.oven()),
}))

// Step 3: Use it

// Node.js
async function runApp() {
  kitchenApp.on("containerCreated", (event) => {
    console.log(
      `event: 'containerCreated' ~~> token: '${event.key}'  | container: `,
      event.newContainer,
    )
  })

  kitchenApp.on("containerRequested", (event) => {
    console.log(`event: 'containerRequested' ~~> token: '${event.key}' `)
  })

  kitchenApp.on("containerRemoved", (event) => {
    console.log(`event: 'containerRemoved' ~~> token: '${event.key}' `)
  })

  await kitchenApp.containers.kitchen
  await wait(200)
}
runApp().then(() => {
  console.log("done")
})

// console.log(123)

// async function runStuff() {
//   let a = new AppContainer()

//   let l = a.KKK
//   console.log(l)

//   let k = await l.auth()
//   let k333 = await l.auth()
//   console.log(k)
//   console.log(k333)

//   let k2 = await l.aCont()
//   let k22 = await l.aCont()
//   console.log(k2)
//   console.log(k22)

//   let k3 = await l.bCont()
//   console.log(k3)
// }

// runStuff().then(() => {
//   console.log("done")
// })

// // async function runStuff() {
// //   let a = new AppContainer()

// //   let k = await a.getKitchenContainer()
// //   let pp = await a.getPizzaPlaceContainer()

// //   pp.diningTables.addNewTable()
// //   pp.diningTables.addNewTable()
// //   pp.diningTables.addNewTable()

// //   k.orderManager.orderPizza(pp.diningTables.tables[1])
// //   k.orderManager.orderPizza(pp.diningTables.tables[2])

// //   console.log(k.orderManager.orders)
// //   k.orderManager.orders.forEach((order) => {
// //     console.log(order.pizza.state)
// //     console.log(JSON.stringify(order.pizza.ingredients))
// //   })
// // }

// // runStuff().then(() => {
// //   console.log("done")
// // })
export const x = { a: 12 }
