import { RootContainer } from "snow-splash"
import type { GenericRegistry, ApplicationContainer } from "snow-splash"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import { provideKitchenContainer } from "./container.kitchen"

import { provideFatLib1 } from "./container.fat-lib1"
import { provideFatLib2 } from "./container.fat-lib2"

interface PizzaRegistry extends GenericRegistry {
  auth: () => ReturnType<typeof provideAuthContainer>
  aCont: () => ReturnType<typeof provideAContainer>
  bCont: () => ReturnType<typeof provideBContainer>
  pizzaContainer: () => ReturnType<typeof providePizzaPlaceContainer>
  kitchen: () => ReturnType<typeof provideKitchenContainer>
  kitchenManipulator: () => ReturnType<
    typeof provideKitchenManipulatorContainer
  >
  fatlib1: () => ReturnType<typeof provideFatLib1>
  fatlib2: () => ReturnType<typeof provideFatLib2>
}

export type PizzaAppContainer = ApplicationContainer<PizzaRegistry>

export function getProviders(ctx: PizzaRegistry, root: PizzaAppContainer) {
  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
    bCont: async () => provideBContainer(await ctx.auth(), await ctx.aCont()),

    // pizza stuff
    pizzaContainer: async () => providePizzaPlaceContainer(await ctx.fatlib2()),
    kitchen: async () => provideKitchenContainer(),

    kitchenManipulator: async () => provideKitchenManipulatorContainer(root),

    // fat libs
    fatlib1: async () => provideFatLib1(),
    fatlib2: async () => provideFatLib2(),
  }
}

export function getMainPizzaAppContainer() {
  return new RootContainer(getProviders)
}
