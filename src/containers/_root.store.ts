import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { A_Container, provideAContainer } from "./container.a"
import { AuthContainer, provideAuthContainer } from "./container.auth"
import { B_Container, provideBContainer } from "./container.b"
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
}

type ContainerRegistryAsFunctions = {
  [P in keyof ContainerRegistry]: () => ContainerRegistry[P]
}

class AppContainerDepenencyTracker {
  auth = async () => provideAuthContainer()
  aCont = async () => provideAContainer(await this.auth())
  bCont = async () => provideBContainer(await this.auth(), await this.aCont())

  // pizza stuff
  pizzaContainer = async () => providePizzaPlaceContainer()
  kitchen = async () => provideKitchenContainer()
}

export class AppContainer extends RootContainer<ContainerRegistry> {
  private ZZZ: ContainerRegistryAsFunctions
  constructor() {
    super()
    this.ZZZ = new AppContainerDepenencyTracker()
  }

  /**
   * We wrap all containers with getGenericContainer
   * @returns
   */
  public getBetterKeys(): ContainerRegistryAsFunctions {
    const FF: any = {}
    _.forOwn(this.ZZZ, (v: any, k: any) => {
      FF[k] = () => this.getGenericContainer(k, v)
    })
    return FF
  }

  public getKeys(): ContainerRegistryAsFunctions {
    return {
      auth: this.getAuthContainer.bind(this),
      pizzaContainer: this.getPizzaPlaceContainer.bind(this),
      aCont: this.getA_Container.bind(this),
      bCont: this.getB_Container.bind(this),
      kitchen: this.getKitchenContainer.bind(this),
    }
  }

  // public lol() {
  //   const containerMap = this.getKeys()
  //   type ContainerKeys = keyof ReturnType<typeof this.getKeys>
  //   type Containers = ReturnType<typeof this.getKeys>

  //   let FFFFF: {
  //     [K in ContainerKeys]: {
  //       _key: K
  //       _container: ReturnType<Containers[K]>
  //       stuff: any
  //     }
  //   } = {} as any

  //   _.forEach(containerMap, (contPromise, contKey) => {
  //     // @ts-ignore
  //     FFFFF[contKey] = {
  //       _container: contPromise(),
  //       _key: contKey,
  //       stuff: ()=>{
  //         this.getGenericContainer(contKey,)
  //       }

  //     }
  //   })
  // }

  public async getAuthContainer() {
    return await this.getGenericContainer("auth", provideAuthContainer)
  }

  public async getA_Container() {
    const auth = await this.getAuthContainer()
    return await this.getGenericContainer("aCont", () =>
      provideAContainer(auth),
    )
  }

  public getKitchenContainerController() {
    return {
      upgradeKitchenConatiner: () => {
        return this.upgradetKitchenContainer()
      },
    }
  }

  public async getKitchenContainer() {
    return await this.getGenericContainer(
      "kitchen",
      () => provideKitchenContainer(),
      //   {
      //   upgradeKitchenConatiner: () => this.upgradetKitchenContainer(),
      // }
    )
  }

  public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
    const k = await this.getKitchenContainer()

    return await this.replaceCointerInstantly("kitchen", () => {
      return provideUpgradedKitchenContainer(k)
    })
  }

  public async getPizzaPlaceContainer() {
    return await this.getGenericContainer(
      "pizzaContainer",
      providePizzaPlaceContainer,
    )
  }

  public async getB_Container() {
    const auth = await this.getAuthContainer()
    const aCont = await this.getA_Container()
    return await this.getGenericContainer("bCont", () =>
      provideBContainer(auth, aCont),
    )
  }
}

// export class SecondAppContainer extends RootContainer<ContainerRegistry> {
//   constructor() {
//     super()
//   }

//   public getKitchenContainerController() {
//     return {
//       upgradeKitchenConatiner: () => {
//         return this.upgradetKitchenContainer()
//       },
//     }
//   }

//   public async getKitchenContainer() {
//     return await this.getGenericContainer("kitchen", () =>
//       provideKitchenContainer({
//         upgradeKitchenConatiner: () => this.upgradetKitchenContainer(),
//       }),
//     )
//   }
//   public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
//     const k = await this.getKitchenContainer()

//     return await this.replaceCointerInstantly("kitchen", () => {
//       return provideUpgradedKitchenContainer(k)
//     })
//   }
// }

// export class Lol
//   extends RootContainer<ContainerRegistry>
//   implements ContainerRegistryAsFunctions
// {
//   auth = async () => provideAuthContainer()
//   pizzaContainer = async () => providePizzaPlaceContainer()
//   aCont = async () => provideAContainer(await this.auth())
//   bCont = async () => provideBContainer(await this.auth(), await this.aCont())
//   kitchen = async () =>
//     provideKitchenContainer({
//       upgradeKitchenConatiner: () => this.upgradetKitchenContainer(),
//     })

//   public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
//     const k = await this.kitchen()

//     return await this.replaceCointerInstantly("kitchen", () => {
//       return provideUpgradedKitchenContainer(k)
//     })
//   }

//   // public getKeys2(): {
//   //   [P in keyof ContainerRegistry]: () => any
//   // } {
//   //   const K = {
//   //     auth: async () => provideAuthContainer(),
//   //     pizzaContainer: this.getPizzaPlaceContainer.bind(this),
//   //     aCont: async () => provideAContainer(await K.auth()),
//   //     bCont: this.getB_Container.bind(this),
//   //     kitchen: this.getKitchenContainer.bind(this),
//   //   }
//   //   return K
//   // }
// }
