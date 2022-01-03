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

class Boot {
  public xx() {
    return 12
  }
}
interface Registry {
  auth: ReturnType<typeof provideAuthContainer>
  aCont: ReturnType<typeof provideAContainer>
  bCont: ReturnType<typeof provideBContainer>
  pizzaContainer: ReturnType<typeof providePizzaPlaceContainer>
  kitchen: ReturnType<typeof provideKitchenContainer>
  _biggerKitchen: ReturnType<typeof provideUpgradedKitchenContainer>
}
type R = {
  [K in keyof Registry]: () => Registry[K]
}

///
class Inner<
  T extends (...args: any) => any,
  R = ReturnType<T>,
  GenericContainerRegistry = {
    [K in keyof R]: R[K]
  },
  SomeDerivedType = Record<string, T>,
> {
  doSomething(p: T) {
    let l: SomeDerivedType = 12 as any
    let l2: R = 12 as any
    console.log(l)
    console.log(l2)
    console.log(p)
  }
}

export class PublishedClass<T extends (...args: any) => any> extends Inner<T> {}

// function(x: PublishedClass<number>){console.log(x)}
// function getProviders2333(root: RootContainer["con"]) {}

///

function getProviders2(ctx: R, root: RootContainer<() => R>) {
  root.replaceCointerInstantly("auth", () => provideAuthContainer)

  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
  }
}

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
  x.replaceCointerInstantly("auth", () => provideAuthContainer)
  let x2: typeof x.providerMap
  return x
}
// type OptionsObject<Map> = {
//   [K in keyof Map]: (r: OptionsObject<Map>) => Map[K]
// }

// type OptionsObjectReamap<Map> = {
//   [K in keyof Map]: (r: OptionsObject<Map>) => Map[K]
// }

// function getProviders2<Map extends {}>(contextMap: OptionsObjectReamap<Map>) {
//   return contextMap
// }

// let x2 = getProviders2({
//   auth: async () => provideAuthContainer(),
//   b: async () => 12,
//   aCont: async (ctx) => {
//     // let auth = ctx.auth
//     // console.log(auth)
//     return 12
//     // let f = provideAContainer(await ctx.auth())
//     // return f
//   },
// })
