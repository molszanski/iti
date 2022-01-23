import _ from "lodash"
import { RootContainer } from "../../library.root-container"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

interface Registry {
  aCont: () => ReturnType<typeof provideAContainer>
  bCont: () => ReturnType<typeof provideBContainer>
  cCont: () => ReturnType<typeof provideCContainer>
}
export type MockAppContainer = RootContainer<
  (...args: any) => { [K in keyof Registry]: Registry[K] }
>

function getProviders(ctx: Registry, root: MockAppContainer) {
  return {
    aCont: async () => provideAContainer(),
    bCont: async () => provideBContainer(await ctx.aCont()),
    cCont: async () =>
      provideCContainer(await ctx.aCont(), await ctx.bCont(), root),
  }
}

export function getMainMockAppContainer() {
  return new RootContainer(getProviders)
}
