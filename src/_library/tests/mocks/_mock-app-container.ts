import _ from "lodash"
import { RootContainer } from "../../library.root-container"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"

interface Registry {
  aCont: () => ReturnType<typeof provideAContainer>
  bCont: () => ReturnType<typeof provideBContainer>
}
export type AppContainer = RootContainer<() => Registry>

function getProviders(ctx: Registry, root: AppContainer) {
  return {
    aCont: async () => provideAContainer(),
    bCont: async () => provideBContainer(await ctx.aCont()),
  }
}

export function getMainMockAppContainer() {
  return new RootContainer(getProviders)
}
