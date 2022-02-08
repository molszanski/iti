import { makeRoot } from "../../src/library.new-root-container"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

// interface Registry {
//   aCont: () => ReturnType<typeof provideAContainer>
//   bCont: () => ReturnType<typeof provideBContainer>
//   cCont: () => ReturnType<typeof provideCContainer>
// }

// export function getProviders(ctx: Registry, root: MockAppContainer) {
//   return {
//     aCont: async () => provideAContainer(),
//     bCont: async () => provideBContainer(await ctx.aCont()),
//   cCont: async () =>
//     provideCContainer(await ctx.aCont(), await ctx.bCont(), root),
// }
// }
export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  let node = makeRoot()
  let k = node
    .addNode({ aCont: async () => provideAContainer() })
    .addNode((c) => {
      return {
        bCont: async () => provideBContainer(await c.get("aCont")),
      }
    })
    .addNode((c) => {
      return {
        cCont: async () =>
          provideCContainer(await c.get("aCont"), await c.get("bCont"), k),
      }
    })
  return k
}
