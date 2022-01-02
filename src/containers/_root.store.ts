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

function getProviders(ctx: RootContainer) {
  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.KKK.auth()),
    bCont: async () =>
      provideBContainer(await ctx.KKK.auth(), await ctx.KKK.aCont()),

    // pizza stuff
    pizzaContainer: async () => providePizzaPlaceContainer(),
    kitchen: async () => provideKitchenContainer(),

    _biggerKitchen: async () => {
      return provideUpgradedKitchenContainer(await ctx.KKK.kitchen())
    },

    kitchenManipulator: async () => {
      // @ts-ignore
      provideKitchenManipulatorContainer(ctx)
    },
  }
}

type R = ReturnType<typeof getProviders>

export class AppContainer extends RootContainer {
  public KKK: R

  constructor() {
    super()
    // @ts-ignore
    this.KKK = {}
    _.forOwn(getProviders(this), (v: any, k: any) => {
      //@ts-ignore
      this.KKK[k] = () => {
        return this.getGenericContainer(k, v)
      }
    })
  }

  public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
    console.log("upgrade called")
    const currentKitchen = await this.KKK.kitchen()

    return await this.replaceCointerInstantly("kitchen", () => {
      return provideUpgradedKitchenContainer(currentKitchen)
    })
  }
}
