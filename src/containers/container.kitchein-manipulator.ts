import { KitchenSizeUIController } from "../stores/_controllers/controller.kitchen"
import { provideUpgradedKitchenContainer } from "./container.kitchen"
import type { PizzaAppContainer } from "./_root.store"

export interface KitchenManipulator_Container {
  kitchenSizeController: KitchenSizeUIController
}

export interface KitchenUpgrader {
  upgradeKitchenConatiner: () => Promise<KitchenManipulator_Container>
}

export async function provideKitchenManipulatorContainer(
  root: PizzaAppContainer,
): Promise<KitchenManipulator_Container> {
  let ksc = new KitchenSizeUIController({
    onKitchenResize: async () => {
      const currentKitchen = await root.providerMap.kitchen()
      return await root.replaceCointerInstantly("kitchen", () =>
        provideUpgradedKitchenContainer(currentKitchen),
      )
    },
  })

  return {
    kitchenSizeController: ksc,
  }
}
