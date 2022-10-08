import { createContainer } from "iti"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  let node = createContainer()
  let k = node
    .upsert({ aCont: async () => provideAContainer() })
    .upsert((c) => {
      return {
        bCont: async () => provideBContainer(await c.aCont),
      }
    })
    .upsert((c, node) => {
      return {
        cCont: async () =>
          provideCContainer(await c.aCont, await node.get("bCont"), k),
      }
    })
  return k
}
