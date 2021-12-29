import { Auth } from "../stores/store.auth"
import { wait } from "../_library/_utils"

export interface AuthContainer {
  auth: Auth
}

export async function provideAuthContainer(): Promise<AuthContainer> {
  const auth = new Auth()
  await wait(500)
  console.log("authorizing user")
  await auth.getToken()
  return {
    auth: auth,
  }
}
