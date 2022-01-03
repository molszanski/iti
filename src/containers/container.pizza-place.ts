import { PizzaPlace, DiningTables } from "../stores/store.pizza-place"

export interface PizzaPlace_Container {
  pizzaPlace: PizzaPlace
  diningTables: DiningTables
}

export async function providePizzaPlaceContainer(): Promise<PizzaPlace_Container> {
  const a1 = new PizzaPlace()
  const a2 = new DiningTables()

  return {
    pizzaPlace: a1,
    diningTables: a2,
  }
}
