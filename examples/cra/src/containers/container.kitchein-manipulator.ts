import { KitchenSizeUIController } from "../stores/_controllers/controller.kitchen"
import { provideUpgradedKitchenContainer } from "./container.kitchen"
import type { PizzaAppCoreContainer } from "./_root.store"

export interface KitchenManipulator_Container {
  kitchenSizeController: KitchenSizeUIController
}

export interface KitchenUpgrader {
  upgradeKitchenConatiner: () => Promise<KitchenManipulator_Container>
}

export async function provideKitchenManipulatorContainer(
  node: PizzaAppCoreContainer,
): Promise<KitchenManipulator_Container> {
  let ksc = new KitchenSizeUIController({
    onKitchenResize: async () => {
      const currentKitchen = await node.containers.kitchen
      return await node.upsert({
        kitchen: () => provideUpgradedKitchenContainer(currentKitchen),
      })
    },
  })

  return {
    kitchenSizeController: ksc,
  }
}
