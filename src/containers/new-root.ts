// import _ from "lodash"
// import { RootContainer } from "../_library/library.root-container"

// import { provideAContainer } from "./container.a"
// import { provideAuthContainer } from "./container.auth"

// function getProviders(ctx: any) {
//   return {
//     auth: async () => provideAuthContainer(),
//     aCont: async () => provideAContainer(await ctx.auth()),
//   }
// }

// let x = new RootContainer(getProviders)
// let f = x.KKK
// let ff = x.dupa()

// // type F = typeof getProviders
// // type R = ReturnType<typeof getProviders>
// // type RR = {
// //   [K in keyof R]: ReturnType<R[K]>
// // }
// // let x = new RootContainer<F, R, RR>(getProviders)

// // export class AppContainer extends RootContainer<F, R, RR> {
// //   constructor() {
// //     //@ts-ignore
// //     super(getProviders)
// //   }

// //   // public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
// //   //   console.log("upgrade called")
// //   //   const currentKitchen = await this.KKK.kitchen()

// //   //   return await this.replaceCointerInstantly("kitchen", () => {
// //   //     return provideUpgradedKitchenContainer(currentKitchen)
// //   //   })
// //   // }
// // }

// // type AllFunctions = (…args: any[]) => any

// class RootContainer22<F, K extends (...args: any) => F> {
//   constructor(public a: F) {}

//   public z(k: K) {
//     console.log(k)
//   }
// }

// let k = new RootContainer22(getProviders)

// class RootContainer33<
//   F,
//   Z extends ReturnType<F>,
//   K extends {
//     [K in keyof Z]: string
//   },
// > {
//   constructor(public a: F) {}

//   public z(): K {
//     let a: any = null
//     return a
//   }
//   public z2(): Z {
//     let a: any = null
//     return a
//   }
// }

// let k2 = new RootContainer33(getProviders)
// let x1 = k2.z()
// let x2 = k2.z2()
