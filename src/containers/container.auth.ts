import { Auth } from "../stores/store.auth"
import { wait } from "../_library/_utils"

export interface AuthContainer {
  auth: Auth
}

export async function provideAuthContainer(): Promise<AuthContainer> {
  console.log("authContainer called")
  const auth = new Auth()
  await wait(500)
  await auth.getToken()
  return {
    auth: auth,
  }
}
