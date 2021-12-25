import type { ContainerGeneric } from "./_container.hooks"
import { useRootStore, useGenericContainer } from "./_container.hooks"
import type { PizzaPlace_Container } from "./container.pizza-place"

export function usePizzaPlaceContainer(): ContainerGeneric<PizzaPlace_Container> {
  const root = useRootStore()
  return useGenericContainer(root.getPizzaPlaceContainer())
}
