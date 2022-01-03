import { KitchenSizeUIController } from "../stores/_controllers/controller.kitchen"
import type { AppContainer } from "./_root.store"

export interface KitchenManipulator_Container {
  kitchenSizeController: KitchenSizeUIController
}

export interface KitchenUpgrader {
  upgradeKitchenConatiner: () => Promise<KitchenManipulator_Container>
}

export async function provideKitchenManipulatorContainer(
  root: AppContainer,
): Promise<KitchenManipulator_Container> {
  let ksc = new KitchenSizeUIController({
    onKitchenResize: () => root.providerMap.upgradetKitchenContainer(),
  })

  return {
    kitchenSizeController: ksc,
  }
}
