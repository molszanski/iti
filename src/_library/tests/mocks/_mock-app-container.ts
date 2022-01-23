import _ from "lodash"
import { RootContainer } from "../../library.root-container"
import { UnPromisify } from "../../_utils"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

interface Registry {
  aCont: () => ReturnType<typeof provideAContainer>
  bCont: () => ReturnType<typeof provideBContainer>
  cCont: () => ReturnType<typeof provideCContainer>
}
export type MockAppContainer = RootContainer<() => Registry>

function getProviders(ctx: Registry, root: MockAppContainer) {
  return {
    aCont: async () => provideAContainer(),
    bCont: async () => provideBContainer(await ctx.aCont()),
    cCont: async () =>
      provideCContainer(await ctx.aCont(), await ctx.bCont(), root),
  }
}

type ContExtractor<
  IncLib extends (...args: any) => {
    [k: string]: () => Promise<unknown>
  },
> = {
  lib: {
    [S in keyof ReturnType<IncLib>]: UnPromisify<
      ReturnType<ReturnType<IncLib>[S]>
    >
  }
  keys: keyof ReturnType<IncLib>
}

type F = ContExtractor<typeof getProviders>

async function useShit<Token extends keyof ReturnType<typeof getProviders>>(
  b: Token[],
): Promise<{
  [S in Token]: UnPromisify<ReturnType<ReturnType<typeof getProviders>[S]>>
}> {
  let root = getMainMockAppContainer()
  let k = await root.getContainerSet(b)
  return k
}

let a = useShit(["cCont", "bCont"]).then((dupa) => console.log(dupa))

export function getMainMockAppContainer() {
  return new RootContainer(getProviders)
}
