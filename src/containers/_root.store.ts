import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { A_Container, provideAContainer } from "./container.a"
import { AuthContainer, provideAuthContainer } from "./container.auth"
import { B_Container, provideBContainer } from "./container.b"
import {
  KitchenManipulator_Container,
  provideKitchenManipulatorContainer,
} from "./container.kitchein-manipulator"
import {
  Kitchen_Container,
  provideKitchenContainer,
  provideUpgradedKitchenContainer,
} from "./container.kitchen"
import {
  PizzaPlace_Container,
  providePizzaPlaceContainer,
} from "./container.pizza-place"

function getDeps(ctx: AppContainer) {
  const that = {
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

    kitchenManipulator: async () => provideKitchenManipulatorContainer(ctx),
  }
  return that
}

export class AppContainer extends RootContainer {
  private ZZZ = getDeps(this)

  public KKK: ReturnType<typeof getDeps>

  constructor() {
    super()

    // @ts-ignore
    this.KKK = {}
    _.forOwn(this.ZZZ, (v: any, k: any) => {
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
