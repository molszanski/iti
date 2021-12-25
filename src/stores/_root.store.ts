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

// interface ContainerCache {
//   state
//   container: Object
// }

type ContainerCache<ContainerType> =
  | {
      state: "fetching"
      containerPromise: Promise<ContainerType>
    }
  | {
      state: "fetched"
      containerPromise: Promise<ContainerType>
      container: ContainerType
    }

interface ContainerRegistry {
  auth: Promise<AuthContainer>
  pizzaContainerSymbol: Promise<PizzaPlace_Container>
}

interface BetterContainerRegistry {
  // authConttainer?: ContainerCache<AuthContainer>
  pizzaContainerSymbol?: ContainerCache<PizzaPlace_Container>
}
type ValueOf<T> = T[keyof T]
export class RootContainer {
  private authContainer?: AuthContainer
  private a?: A_Container
  private b?: B_Container
  private pizzaPlace?: PizzaPlace_Container

  private fetchingStates: { [key: string]: ContainerState } = {}
  private containerCache: Partial<ContainerRegistry> = {}

  // private betterContainerCache: BetterContainerRegistry = {}

  public async getPizzaPlaceContainer2(): Promise<PizzaPlace_Container> {
    const key = "pizzaContainerSymbol" as const
    const containerProvider = providePizzaPlaceContainer
    const z = await this.getGenericContainer(key, containerProvider)

    return
  }

  public async getGenericContainer(
    key: keyof ContainerRegistry,
    containerProvider: () => ValueOf<ContainerRegistry>,
    // ): Promise<ContainerInstance> {
  ): Promise<ValueOf<ContainerRegistry>> {
    // let k: ValueOf<ContainerRegistry>
    // console.log(k)
    // if (this.betterContainerCache[key] == null) {
    //   const containerPromise = containerProvider()

    //   this.betterContainerCache[key] = {
    //     state: "fetching",
    //     containerPromise: containerPromise,
    //   }
    // }

    // if (this.fetchingStates[key] == null) {
    //   this.fetchingStates[key] = "fetching"
    //   const containerPromise = containerProvider()
    //   this.containerCache[key] = containerPromise as any
    //   await containerPromise
    //   this.fetchingStates[key] = "fetched"
    //   return containerPromise
    // }

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

    // if (
    //   this.fetchingStates[key] === "fetching" &&
    //   this.containerCache[key] != null
    // ) {
    //   const containerPromise = this.containerCache[key]
    //   const cache = await containerPromise
    //   if (cache != null) {
    //     return cache
    //   }
    // }
    // if (this.fetchingStates[key] === "fetched") {
    //   const cache = await this.containerCache[key]
    //   if (cache != null) {
    //     return cache
    //   }
    // }
    throw new Error("WTF")
  }

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
