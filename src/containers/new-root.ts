import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"

function getProviders(ctx: any) {
  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
  }
}

type F = typeof getProviders
type R = ReturnType<typeof getProviders>
type RR = {
  [K in keyof R]: ReturnType<R[K]>
}
let x = new RootContainer<F, R, RR>(getProviders)

export class AppContainer extends RootContainer<F, R, RR> {
  constructor() {
    //@ts-ignore
    super(getProviders)
  }

  // public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
  //   console.log("upgrade called")
  //   const currentKitchen = await this.KKK.kitchen()

  //   return await this.replaceCointerInstantly("kitchen", () => {
  //     return provideUpgradedKitchenContainer(currentKitchen)
  //   })
  // }
}
