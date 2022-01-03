import { getAuthType, setAuthType, AuthType } from "../services/url-param"

const wait = (w: number) => new Promise((r) => setTimeout(r, w))

export class Auth {
  public async getToken(): Promise<string> {
    await wait(200)
    return "token123"
  }

  public async getUser(): Promise<any> {
    await wait(200)
    return { name: "lol" }
  }

  public async getUserType() {
    await wait(500)
    const t = getAuthType()
    return t
  }

  public async changeUser(at: AuthType) {
    await wait(400)
    setAuthType(at)
  }
}
