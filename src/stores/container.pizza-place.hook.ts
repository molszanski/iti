import { useRootStore } from "./_container.hooks"
import type { PizzaPlace_Container } from "./container.pizza-place"

import { useGenericContainer, ContainerGeneric } from "../library/library.hooks"

export function usePizzaPlaceContainer(): ContainerGeneric<PizzaPlace_Container> {
  const root = useRootStore()
  return useGenericContainer(root.getPizzaPlaceContainer2())
}
