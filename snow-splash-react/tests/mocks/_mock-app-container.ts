import { makeRoot } from "snow-splash"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

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
