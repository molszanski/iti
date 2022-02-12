import { makeRoot } from "box-maker"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  let node = makeRoot()
  let k = node
    .upsert({ aCont: async () => provideAContainer() })
    .upsert((c) => {
      return {
        bCont: async () => provideBContainer(await c.get("aCont")),
      }
    })
    .upsert((c) => {
      return {
        cCont: async () =>
          provideCContainer(await c.get("aCont"), await c.get("bCont"), k),
      }
    })
  return k
}
