import { makeRoot } from "iti"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import { provideKitchenContainer } from "./container.kitchen"

import { provideFatLib1 } from "./container.fat-lib1"
import { provideFatLib2 } from "./container.fat-lib2"

export type PizzaAppCoreContainer = ReturnType<typeof pizzaAppCore>
export function pizzaAppCore() {
  return makeRoot()
    .add(() => ({
      auth: async () => provideAuthContainer(),
    }))
    .add((c) => ({
      aCont: async () => provideAContainer(await c.auth),
    }))
    .add((ctx) => ({
      bCont: async () => provideBContainer(await ctx.auth, await ctx.aCont),
    }))
    .add((c) => ({
      // fat libs
      fatlib1: async () => provideFatLib1(),
      fatlib2: async () => provideFatLib2(),
    }))
    .add((ctx, node) => ({
      // pizza stuff
      pizzaContainer: async () => providePizzaPlaceContainer(await ctx.fatlib2),
      kitchen: async () => provideKitchenContainer(),
    }))
}

export type PizzaAppContainer = ReturnType<typeof getMainPizzaAppContainer>
export function getMainPizzaAppContainer() {
  return pizzaAppCore().add((ctx, node) => ({
    kitchenManipulator: async () => provideKitchenManipulatorContainer(node),
  }))
}
