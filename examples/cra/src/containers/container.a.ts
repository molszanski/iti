import type { AuthContainer } from "./container.auth"
import { A1, A2, A3 } from "../stores/store.a"

export interface A_Container {
  a1: A1
  a2: A2
  a3: A3
}

export async function provideAContainer(
  auth: AuthContainer,
): Promise<A_Container> {
  const a1 = new A1(auth.auth)
  const a2 = new A2(a1, auth.auth)
  const a3 = new A3(a1, a2)

  return {
    a1,
    a2,
    a3,
  }
}
