import { Authorization } from "../stores/store.authorization"
import { Auth } from "../stores/store.auth"
import { wait } from "./_utils"

export interface AuthContainer {
  auth: Auth
  authorization: Authorization
}

export async function provideAuthContainer(): Promise<AuthContainer> {
  const auth = new Auth()
  await wait(50)
  await auth.getToken()
  let x = await auth.getUserType()
  return {
    auth: auth,
    authorization: new Authorization(x),
  }
}
