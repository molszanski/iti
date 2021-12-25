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
}
