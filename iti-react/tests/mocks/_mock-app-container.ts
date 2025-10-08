import { createContainer } from "iti"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  let cont = createContainer()
  let k = cont
    .upsert({ aCont: async () => provideAContainer() })
    .upsert((c) => {
      return {
        bCont: async () => provideBContainer(await c.aCont),
      }
    })
    .upsert((c, cont) => {
      return {
        cCont: async () =>
          provideCContainer(await c.aCont, await cont.get("bCont"), k),
      }
    })
  return k
}
