import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
// import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import {
  provideKitchenContainer,
  provideUpgradedKitchenContainer,
} from "./container.kitchen"

interface NestedObject {
  name: string
  value: number
  children?: NestedObject[]
}

type OptionsObject<Map> = {
  [K in keyof Map]: () => Map[K]
}

type OptionsObjectReamap<Map> = {
  [K in keyof Map]: (r: OptionsObject<Map>) => Map[K]
}

function getProviders2<Map extends {}>(contextMap: OptionsObjectReamap<Map>) {
  return contextMap
}

let x2 = getProviders2({
  auth: async () => provideAuthContainer(),
  aCont: async (ctx) => provideAContainer(await ctx.auth()),
})

function getProviders(ctx: any) {
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

    // kitchenManipulator: async () => {
    //   // @ts-ignore
    //   provideKitchenManipulatorContainer(ctx)
    // },
  }
}

export function lol() {
  let x = new RootContainer(getProviders)
  return x
}
