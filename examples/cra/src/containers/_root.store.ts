import { makeRoot } from "snow-splash"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import { provideKitchenContainer } from "./container.kitchen"

import { provideFatLib1 } from "./container.fat-lib1"
import { provideFatLib2 } from "./container.fat-lib2"

// interface PizzaRegistry {
//   auth: () => ReturnType<typeof provideAuthContainer>
//   aCont: () => ReturnType<typeof provideAContainer>
//   bCont: () => ReturnType<typeof provideBContainer>
//   pizzaContainer: () => ReturnType<typeof providePizzaPlaceContainer>
//   kitchen: () => ReturnType<typeof provideKitchenContainer>
//   kitchenManipulator: () => ReturnType<
//     typeof provideKitchenManipulatorContainer
//   >
//   fatlib1: () => ReturnType<typeof provideFatLib1>
//   fatlib2: () => ReturnType<typeof provideFatLib2>
// }

// type Lib = (...args: any) => { [K in keyof PizzaRegistry]: PizzaRegistry[K] }
// export type PizzaAppContainer = RootContainer<Lib, ReturnType<Lib>>

// export function getProviders(container: PizzaAppContainer) {
//   return {
//     auth: async () => provideAuthContainer(),
//     aCont: async () => provideAContainer(await ctx.auth()),

//     // pizza stuff
//     // pizzaContainer: async () => providePizzaPlaceContainer(await ctx.fatlib2()),
//     // kitchen: async () => provideKitchenContainer(),

//     kitchenManipulator: async () => provideKitchenManipulatorContainer(root),

//     // // fat libs
//     // fatlib1: async () => provideFatLib1(),
//     // fatlib2: async () => provideFatLib2(),
//   }
// }
export type PizzaAppContainer = ReturnType<typeof getMainPizzaAppContainer>
export function getMainPizzaAppContainer() {
  let a = makeRoot()
    .addNode(() => ({
      auth: async () => provideAuthContainer(),
    }))
    .addNode((c) => ({
      aCont: async () => provideAContainer(await c.containers.auth),
    }))
    .addNode((ctx) => ({
      bCont: async () =>
        provideBContainer(
          await ctx.containers.auth(),
          await ctx.containers.aCont(),
        ),
    }))
    .addNode((c) => ({
      // fat libs
      fatlib1: async () => provideFatLib1(),
      fatlib2: async () => provideFatLib2(),
    }))
    .addNode((ctx) => ({
      // pizza stuff
      pizzaContainer: async () =>
        providePizzaPlaceContainer(await ctx.containers.fatlib2),
      kitchen: async () => provideKitchenContainer(),
      kitchenManipulator: async () => provideKitchenManipulatorContainer(ctx),
    }))
  return a
}
