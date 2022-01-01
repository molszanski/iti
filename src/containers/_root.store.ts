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

interface ContainerRegistry {
  auth: Promise<AuthContainer>
  pizzaContainer: Promise<PizzaPlace_Container>
  aCont: Promise<A_Container>
  bCont: Promise<B_Container>
  kitchen: Promise<Kitchen_Container>
  kitchenManipulator: Promise<KitchenManipulator_Container>
}

type ContainerRegistryAsFunctions = {
  [P in keyof ContainerRegistry]: () => ContainerRegistry[P]
}
function getDeps(ctx: AppContainer) {
  const that = {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.KKK.auth()),
    bCont: async () =>
      provideBContainer(await ctx.KKK.auth(), await ctx.KKK.aCont()),

    // pizza stuff
    pizzaContainer: async () => providePizzaPlaceContainer(),
    kitchen: async () => provideKitchenContainer(),

    _biggerKitchen: async () =>
      provideUpgradedKitchenContainer(await ctx.KKK.kitchen()),
    kitchenManipulator: async () => provideKitchenManipulatorContainer(ctx),
  }
  return that
}

export class AppContainer extends RootContainer<ContainerRegistry> {
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

  /**
   * We wrap all containers with getGenericContainer
   * @returns
   */
  public getBetterKeys(): ContainerRegistryAsFunctions {
    return this.KKK
  }

  public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
    const currentKitchen = await this.getBetterKeys().kitchen()

    return await this.replaceCointerInstantly("kitchen", () => {
      return provideUpgradedKitchenContainer(currentKitchen)
    })
  }
}
