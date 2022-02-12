import { makeRoot } from "../../src/library.new-root-container"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  let node = makeRoot()
  let k = node
    .add({ aCont: async () => provideAContainer() })
    .add((c) => {
      return {
        bCont: async () => provideBContainer(await c.get("aCont")),
      }
    })
    .add((c) => {
      return {
        cCont: async () =>
          provideCContainer(await c.get("aCont"), await c.get("bCont"), k),
      }
    })
  return k
}
