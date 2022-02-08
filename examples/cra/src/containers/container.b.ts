import type { A_Container } from "./container.a"
import type { AuthContainer } from "./container.auth"
import { B1, B2 } from "../stores/store.b"
import { wait } from "./_utils"

export interface B_Container {
  b1: B1
  b2: B2
}

export async function provideBContainer(
  auth: AuthContainer,
  a: A_Container,
): Promise<B_Container> {
  const b1 = new B1(auth.auth, a.a2)

  await wait(70)
  const b2 = new B2(auth.auth, a.a1)

  return {
    b1,
    b2,
  }
}
