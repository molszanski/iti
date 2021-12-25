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

interface ContainerRegistry {
  auth: Promise<AuthContainer>
  pizzaContainerSymbol: Promise<PizzaPlace_Container>
}

type ValueOf<T> = T[keyof T]
export class RootContainer {
  private authContainer?: AuthContainer
  private a?: A_Container
  private b?: B_Container

  private containerCache: Partial<ContainerRegistry> = {}

  public async getPizzaPlaceContainer2(): Promise<PizzaPlace_Container> {
    const key = "pizzaContainerSymbol" as const
    const containerProvider = providePizzaPlaceContainer
    const z = await this.getGenericContainer(key, containerProvider)

    return z
  }

  public async getGenericContainer<T extends ValueOf<ContainerRegistry>>(
    key: keyof ContainerRegistry,
    containerProvider: () => T,
  ): Promise<T> {
    if (this.containerCache[key] == null) {
      const containerPromise = containerProvider()
      this.containerCache[key] = containerPromise as any
      await containerPromise
      return containerPromise
    }

    if (this.containerCache[key] != null) {
      const containerPromise = this.containerCache[key]
      if (containerPromise != null) {
        await containerPromise
        return containerPromise
      }
    }

    throw new Error("WTF")
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
