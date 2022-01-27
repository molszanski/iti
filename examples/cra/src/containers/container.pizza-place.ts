import { PizzaPlace, DiningTables } from "../stores/store.pizza-place"
import type { FatLib2Container } from "./container.fat-lib2"

export interface PizzaPlace_Container {
  pizzaPlace: PizzaPlace
  diningTables: DiningTables
}

export async function providePizzaPlaceContainer(
  fatLib2Container: FatLib2Container,
): Promise<PizzaPlace_Container> {
  const a1 = new PizzaPlace(fatLib2Container.getFatLib2Data)
  const a2 = new DiningTables()

  return {
    pizzaPlace: a1,
    diningTables: a2,
  }
}
