import { IngredientsService } from "../services/ingredients-manager"
import type { Ingredients } from "../stores/store.ingrediets"
import { Kitchen, OrderManager } from "../stores/store.kitchen"
import { Oven } from "../stores/store.oven"

export interface Kitchen_Container {
  oven: Oven
  ingredients: Ingredients
  orderManager: OrderManager
  kitchen: Kitchen
}

export interface KitchenUpgrader {
  upgradeKitchenConatiner: () => Promise<Kitchen_Container>
}

export async function provideKitchenContainer(): Promise<Kitchen_Container> {
  let oven = new Oven()
  let ingredients = await IngredientsService.buySomeIngredients()

  let kitchen = new Kitchen(oven, ingredients)
  let orders = new OrderManager(kitchen)
  // let ksc = new KitchenSizeUIController({
  //   onKitchenResize: controls.upgradeKitchenConatiner,
  // })

  return {
    oven: oven,
    orderManager: orders,
    ingredients: ingredients,
    kitchen: kitchen,
  }
}

export async function provideUpgradedKitchenContainer(
  prevContainer: Kitchen_Container,
): Promise<Kitchen_Container> {
  let biggerOven = new Oven(8)

  // Here is one way of data migration
  let kitchen = new Kitchen(biggerOven, prevContainer.ingredients)
  let orderManager = new OrderManager(kitchen)
  orderManager.orders = prevContainer.orderManager.orders

  return {
    oven: biggerOven,
    orderManager: orderManager,
    ingredients: prevContainer.ingredients,
    // kitchenSizeController: prevContainer.kitchenSizeController,
    kitchen: kitchen,
  }
}
