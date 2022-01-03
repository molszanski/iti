import _ from "lodash"
import { RootContainer } from "../_library/library.root-container"

import { provideAContainer } from "./container.a"
import { provideAuthContainer } from "./container.auth"

interface Registry {
  auth: () => ReturnType<typeof provideAuthContainer>
  aCont: () => ReturnType<typeof provideAContainer>
}
export type AppContainer = RootContainer<() => Registry>

function playground(ctx: Registry, root: AppContainer) {
  let x2: typeof root.providerMap
  let x3: keyof typeof root.providerMap

  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
  }
}

function getProviders(ctx: Registry, root: AppContainer) {
  return {
    auth: async () => provideAuthContainer(),
    aCont: async () => provideAContainer(await ctx.auth()),
  }
}

export function lol() {
  let x = new RootContainer(getProviders)
  x.replaceCointerInstantly("auth", () => provideAuthContainer())
  let x2: typeof x.providerMap
  let x3: typeof x.haha
  return x
}
