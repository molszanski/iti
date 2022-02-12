import { makeRoot } from "iti"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import { provideKitchenContainer } from "./container.kitchen"

import { provideFatLib1 } from "./container.fat-lib1"
import { provideFatLib2 } from "./container.fat-lib2"

export type PizzaAppContainer = ReturnType<typeof getMainPizzaAppContainer>
export function getMainPizzaAppContainer() {
  let a = makeRoot()
    .upsert(() => ({
      auth: async () => provideAuthContainer(),
    }))
    .upsert((c) => ({
      //@ts-ignore
      aCont: async () => provideAContainer(await c.containers.auth),
    }))
    .upsert((ctx) => ({
      bCont: async () =>
        provideBContainer(
          await ctx.containers.auth(),
          await ctx.containers.aCont(),
        ),
    }))
    .upsert((c) => ({
      // fat libs
      fatlib1: async () => provideFatLib1(),
      fatlib2: async () => provideFatLib2(),
    }))
    .upsert((ctx) => ({
      // pizza stuff
      pizzaContainer: async () =>
        //@ts-ignore
        providePizzaPlaceContainer(await ctx.containers.fatlib2),
      kitchen: async () => provideKitchenContainer(),
      //@ts-ignore
      kitchenManipulator: async () => provideKitchenManipulatorContainer(ctx),
    }))
  return a
}
