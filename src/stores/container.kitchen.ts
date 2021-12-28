import { IngredientsController } from "./controller.ingredients-manager"
import type { Ingredients } from "./store.ingrediets"
import { Kitchen } from "./store.kitchen"
import { Oven } from "./store.oven"

export interface Kitchen_Container {
  oven: Oven
  ingredients: Ingredients
  kitchen: Kitchen
}

export async function provideKitchenContainer(): Promise<Kitchen_Container> {
  let z = new Oven()
  let f = await IngredientsController.buySomeIngredients()

  let q = new Kitchen(z, f)

  return {
    oven: z,
    ingredients: f,
    kitchen: q,
  }
}
