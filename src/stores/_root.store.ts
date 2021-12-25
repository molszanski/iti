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

// type EditotContainers = AuthContainer | A_Container;``
type ContainerState = "pristine" | "fetching" | "fetched"

const Symbs = {
  pizzaContainer: "pizzaContainerSymbol",
}

interface ContainerRegistry {
  pizzaContainerSymbol?: Promise<PizzaPlace_Container>
}

export class RootContainer {
  private authContainer?: AuthContainer
  private a?: A_Container
  private b?: B_Container
  private pizzaPlace?: PizzaPlace_Container

  private fetchingStates: { [key: string]: ContainerState } = {}
  private containerCache: ContainerRegistry = {}

  public async getPizzaPlaceContainer(): Promise<PizzaPlace_Container> {
    const key = "pizzaContainerSymbol" as const
    const containerProvider = providePizzaPlaceContainer

    if (this.fetchingStates[key] == null) {
      this.fetchingStates[key] = "pristine"
    }

    if (this.fetchingStates[key] === "pristine") {
      this.fetchingStates[key] = "fetching"
      const containerPromise = containerProvider()
      this.containerCache[key] = containerPromise
      this.pizzaPlace = await containerPromise
      this.fetchingStates[key] = "fetched"
      return this.pizzaPlace
    }
    if (this.fetchingStates[key] === "fetching") {
      const cache = await this.containerCache[key]
      if (cache != null) {
        return cache
      }
    }
    if (this.fetchingStates[key] === "fetched") {
      const cache = await this.containerCache[key]
      if (cache != null) {
        return cache
      }
    }
    throw new Error("WTF")

    // if (this.fetchingStates[key] === "fetched" && this.containerCache[key] != null) {
    //   const cache = await this.containerCache[key]
    //   return cache
    // }
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
