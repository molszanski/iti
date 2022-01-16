import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import { provideKitchenContainer } from "./container.kitchen"
import { provideFatLib1 } from "./container.fat-lib1"

interface PizzaRegistry {
  auth: () => ReturnType<typeof provideAuthContainer>
  aCont: () => ReturnType<typeof provideAContainer>
  bCont: () => ReturnType<typeof provideBContainer>
  pizzaContainer: () => ReturnType<typeof providePizzaPlaceContainer>
  kitchen: () => ReturnType<typeof provideKitchenContainer>
  kitchenManipulator: () => ReturnType<
    typeof provideKitchenManipulatorContainer
  >
  fatlib1: () => ReturnType<typeof provideFatLib1>
}
export type PizzaAppContainer = RootContainer<() => PizzaRegistry>

function getProviders(ctx: PizzaRegistry, root: PizzaAppContainer) {
  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
    bCont: async () => provideBContainer(await ctx.auth(), await ctx.aCont()),

    // pizza stuff
    pizzaContainer: async () => providePizzaPlaceContainer(),
    kitchen: async () => provideKitchenContainer(),

    kitchenManipulator: async () => provideKitchenManipulatorContainer(root),

    // fat libs
    fatlib1: async () => provideFatLib1(),
  }
}

export function getMainPizzaAppContainer() {
  return new RootContainer(getProviders)
}
