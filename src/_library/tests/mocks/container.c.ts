import type { A_Container } from "./container.a"
import { B_Container } from "./container.b"
import { C1, C2 } from "./store.c"
import { MockAppContainer } from "./_mock-app-container"

export interface C_Container {
  c1: C1
  c2: C2
  upgradeCContainer: () => void
}

export async function provideCContainer(
  a: A_Container,
  b: B_Container,
  root: MockAppContainer,
): Promise<C_Container> {
  const c1 = new C1(a.a2)
  const c2 = new C2(a.a1, b.b2, 5)

  async function reaplacer() {
    return await root.replaceCointerInstantly("cCont", async () => {
      const c1 = new C1(a.a2)
      const c2 = new C2(a.a1, b.b2, 10)
      return {
        c1,
        c2,
        upgradeCContainer: reaplacer,
      }
    })
  }

  return {
    c1,
    c2,
    upgradeCContainer: reaplacer,
  }
}
