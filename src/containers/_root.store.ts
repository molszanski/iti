import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import {
  provideKitchenContainer,
  provideUpgradedKitchenContainer,
} from "./container.kitchen"

interface Registry {
  auth: () => ReturnType<typeof provideAuthContainer>
  aCont: () => ReturnType<typeof provideAContainer>
  bCont: () => ReturnType<typeof provideBContainer>
  pizzaContainer: () => ReturnType<typeof providePizzaPlaceContainer>
  kitchen: () => ReturnType<typeof provideKitchenContainer>
  _biggerKitchen: () => ReturnType<typeof provideUpgradedKitchenContainer>
  upgradetKitchenContainer: () => ReturnType<
    typeof provideUpgradedKitchenContainer
  >
  kitchenManipulator: () => ReturnType<
    typeof provideKitchenManipulatorContainer
  >
}
export type AppContainer = RootContainer<() => Registry>

function playground(ctx: Registry, root: AppContainer) {
  let x2: typeof root.providerMap
  let x3: keyof typeof root.providerMap

  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
  }
}

function getProviders(ctx: Registry, root: AppContainer) {
  setTimeout(() => {
    root.replaceCointerInstantly("auth", () => provideAuthContainer())
  }, 900)
  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
    bCont: async () => provideBContainer(await ctx.auth(), await ctx.aCont()),

    // pizza stuff
    pizzaContainer: async () => providePizzaPlaceContainer(),
    kitchen: async () => provideKitchenContainer(),

    _biggerKitchen: async () => {
      return provideUpgradedKitchenContainer(await ctx.kitchen())
    },

    upgradetKitchenContainer: async () => {
      const currentKitchen = await ctx.kitchen()

      return await root.replaceCointerInstantly("kitchen", () => {
        return provideUpgradedKitchenContainer(currentKitchen)
      })
    },

    kitchenManipulator: async () => {
      return provideKitchenManipulatorContainer(root)
    },
  }
}

export function lol() {
  let x = new RootContainer(getProviders)
  x.replaceCointerInstantly("auth", () => provideAuthContainer())
  let x2: typeof x.providerMap
  let x3: typeof x.haha
  return x
}
