import { makeAutoObservable } from "mobx"
import { getAuthType, setAuthType, AuthType } from "../services/url-param"

const wait = (w: number) => new Promise((r) => setTimeout(r, w))

const RightsDB = {
  unauthenticated: {
    orderPizza: true,
    addTables: false,
    upgradeKitchen: false,
  },
  manager: {
    orderPizza: true,
    addTables: true,
    upgradeKitchen: false,
  },
  admin: {
    orderPizza: true,
    addTables: true,
    upgradeKitchen: true,
  },
} as const

function rightsLookup<T extends { [key in AuthType]: any }>(rights: T) {
  return rights
}

export class Authorization {
  constructor(public readonly userType: AuthType) {
    makeAutoObservable(this)
  }

  /**
   * this API might look weird but this helps typescript
   * k.getAvaliableActions()["admin"]
   */
  public getAvaliableActions() {
    return rightsLookup(RightsDB)
  }

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
    const t = getAuthType
    return t
  }
}
