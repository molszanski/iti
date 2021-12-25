import { configure, observable, action } from "mobx"
import { A_Container, provideAContainer } from "./container.a"
import { AuthContainer, provideAuthContainer } from "./container.auth"
import { B_Container, provideBContainer } from "./container.b"
import {
  PizzaPlace_Container,
  providePizzaPlaceContainer,
} from "./container.pizza-place"

// don't allow state modifications outside actions
configure({ enforceActions: "always" })

//
type ValueOf<T> = T[keyof T]

export class RootContainer {
  private containerCache: Partial<ContainerRegistry> = {}

  public async getGenericContainer<T extends ValueOf<ContainerRegistry>>(
    key: keyof ContainerRegistry,
    containerProvider: () => T,
  ): Promise<T> {
    if (this.containerCache[key] == null) {
      console.log("requesting new container")
      const containerPromise = containerProvider()
      this.containerCache[key] = containerPromise as any
    }

    if (this.containerCache[key] != null) {
      console.log("getting from cache container")
      const containerPromise = this.containerCache[key]
      if (containerPromise != null) {
        await containerPromise
        return containerPromise
      }
    }

    throw new Error("WTF")
  }
}

interface ContainerRegistry {
  auth: Promise<AuthContainer>
  pizzaContainerSymbol: Promise<PizzaPlace_Container>
}

export class AppContainer extends RootContainer {
  private authContainer?: AuthContainer
  private a?: A_Container
  private b?: B_Container

  constructor() {
    super()
  }

  public async getPizzaPlaceContainer2(): Promise<PizzaPlace_Container> {
    return await this.getGenericContainer(
      "pizzaContainerSymbol",
      providePizzaPlaceContainer,
    )
  }

  public async getAuthContainer(): Promise<AuthContainer> {
    if (!this.authContainer) {
      this.authContainer = await provideAuthContainer()
    }

    return this.authContainer
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
