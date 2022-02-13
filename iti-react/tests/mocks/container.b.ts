import type { A_Container } from "./container.a"
import { B1, B2 } from "./store.b"

export interface B_Container {
  b1: B1
  b2: B2
}

export async function provideBContainer(a: A_Container): Promise<B_Container> {
  const b1 = new B1(a.a2)

  const b2 = new B2(a.a1)

  return {
    b1,
    b2,
  }
}
