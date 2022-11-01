import _ from "lodash"
import { createContainer } from "iti"

// Step 1: Your application logic stays clean
class Oven {
  public pizzasInOven() {
    return 3
  }
  public async preheat() {}
}
class Kitchen {
  constructor(public oven: Oven, public manual: string) {}
}

// Step 2: Add and read simple tokens
let root = createContainer().add({
  userManual: "Please preheat before use",
  oven: () => new Oven(),
})
root.get("oven")

// Step 3: Add a useful async provider / container
const kitchenContainer = async ({ oven, userManual }) => {
  await oven.preheat()
  return {
    kitchen: new Kitchen(oven, userManual),
  }
}

// Step 4: Add an async provider
const node = root.add((ctx, node) => ({
  kitchen: async () =>
    kitchenContainer(await node.getContainerSet(["userManual", "oven"])),
}))
await node.get("kitchen")

// A SHORT USE MANUAL
// A SHORT USE MANUAL
// A SHORT USE MANUAL

// ---- Reading

// Get a single instance
root.get("oven") // Creates a new Oven instance
root.get("oven") // Gets a cached Oven instance

await node.get("kitchen") // { kitchen: Kitchen } also cached
await node.items.kitchen // same as above

// Get multiple instances at once
await root.getContainerSet(["oven", "userManual"]) // { userManual: '...', oven: Oven }
await root.getContainerSet((c) => [c.userManual, c.oven]) // same as above

// Subscribe to container changes
node.subscribeToContainer("oven", (oven) => {})
node.subscribeToContainerSet(["oven", "kitchen"], ({ oven, kitchen }) => {})
// prettier-ignore
node.subscribeToContainerSet((c) => [c.kitchen], ({ oven, kitchen }) => {})
node.on("containerUpdated", ({ key, newContainer }) => {})
node.on("containerUpserted", ({ key, newContainer }) => {})

// ----Adding

let node1 = createContainer()
  .add({
    userManual: "Please preheat before use",
    oven: () => new Oven(),
  })
  .upsert((ctx) => ({
    userManual: "Works better when hot",
    preheatedOven: async () => {
      await ctx.oven.preheat()
      return ctx.oven
    },
  }))

// `add` is typesafe and a runtime safe method. Hence we've used `upsert`
try {
  node1.add({
    // @ts-expect-error
    userManual: "You shall not pass",
    // Type Error: (property) userManual: "You are overwriting this token. It is not safe. Use an unsafe `upsert` method"
  })
} catch (err) {
  err.message // Error Tokens already exist: ['userManual']
}

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

// export const x = { a: 12 }
