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

export class AppContainer extends RootContainer<ContainerRegistry> {
  constructor() {
    super()
  }

  public getKitchenContainerController() {
    return {
      upgradeKitchenConatiner: () => {
        return this.upgradetKitchenContainer()
      },
    }
  }

  public async getKitchenContainer() {
    return await this.getGenericContainer("kitchen", () =>
      provideKitchenContainer({
        upgradeKitchenConatiner: () => this.upgradetKitchenContainer(),
      }),
    )
  }

  public async upgradetKitchenContainer(): Promise<Kitchen_Container> {
    const k = await this.getKitchenContainer()

    return await this.replaceCointerInstantly("kitchen", () => {
      return provideUpgradedKitchenContainer(k, {
        upgradeKitchenConatiner: () => this.upgradetKitchenContainer(),
      })
    })
  }

  public async getPizzaPlaceContainer() {
    return await this.getGenericContainer(
      "pizzaContainer",
      providePizzaPlaceContainer,
    )
  }

  public async getAuthContainer() {
    return await this.getGenericContainer("auth", provideAuthContainer)
  }

  public async getA_Container() {
    const auth = await this.getAuthContainer()
    return await this.getGenericContainer("aCont", () =>
      provideAContainer(auth),
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
