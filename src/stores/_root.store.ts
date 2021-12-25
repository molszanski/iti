import { RootContainer } from "../library/library.root-container"

import { A_Container, provideAContainer } from "./container.a"
import { AuthContainer, provideAuthContainer } from "./container.auth"
import { B_Container, provideBContainer } from "./container.b"
import {
  PizzaPlace_Container,
  providePizzaPlaceContainer,
} from "./container.pizza-place"

interface ContainerRegistry {
  auth: Promise<AuthContainer>
  pizzaContainer: Promise<PizzaPlace_Container>
}

export class AppContainer extends RootContainer<ContainerRegistry> {
  private a?: A_Container
  private b?: B_Container

  constructor() {
    super()
  }

  public async getPizzaPlaceContainer2(): Promise<PizzaPlace_Container> {
    return await this.getGenericContainer(
      "pizzaContainer",
      providePizzaPlaceContainer,
    )
  }

  public async getAuthContainer(): Promise<AuthContainer> {
    return await this.getGenericContainer("auth", provideAuthContainer)
  }

  public async getA_Container(): Promise<A_Container> {
    if (!this.a) {
      const auth = await this.getAuthContainer()
      this.a = await provideAContainer(auth)
    }

    return this.a
  }

  public async getB_Container(): Promise<B_Container> {
    if (!this.b) {
      const auth = await this.getAuthContainer()
      const a = await this.getA_Container()
      this.b = await provideBContainer(auth, a)
    }

    return this.b
  }
}
