import { createContainer } from "../../src/iti"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  let node = createContainer()
  let k = node
    .add({ aCont: async () => provideAContainer() })
    .add((c, node) => {
      return {
        bCont: async () => provideBContainer(await node.get("aCont")),
      }
    })
    .add((c) => {
      return {
        cCont: async () => provideCContainer(await c.aCont, await c.bCont, k),
      }
    })
  return k
}
