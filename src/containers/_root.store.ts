import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"
import { provideBContainer } from "./container.b"
import { provideKitchenManipulatorContainer } from "./container.kitchein-manipulator"
import { providePizzaPlaceContainer } from "./container.pizza-place"
import {
  Kitchen_Container,
  provideKitchenContainer,
  provideUpgradedKitchenContainer,
} from "./container.kitchen"

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

type F = typeof getProviders
type R = ReturnType<typeof getProviders>
type RR = {
  [K in keyof R]: ReturnType<R[K]>
}
let x = new RootContainer(getProviders)

export function lol() {
  let x = new RootContainer(getProviders)
  return x
}

export class AppContainer extends RootContainer<F, R, RR> {
  constructor() {
    //@ts-ignore
    super(getProviders)
  }

  public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
    console.log("upgrade called")
    const currentKitchen = await this.KKK.kitchen()

    return await this.replaceCointerInstantly("kitchen", () => {
      return provideUpgradedKitchenContainer(currentKitchen)
    })
  }
}
