import { makeObservable, observable, computed, action, autorun } from "mobx"
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
  constructor(private _userType: AuthType) {
    makeObservable(this, {
      // @ts-expect-error
      _userType: observable,
      userType: computed,
      changeUser: action,
    })
  }

  get userType() {
    return this._userType
  }

  /**
   * this API might look weird but this helps typescript
   * k.getAvailableActions()["admin"]
   */
  public getAvailableActions() {
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

  public async changeUser(at: AuthType) {
    await wait(400)
    this._userType = at
    setAuthType(at)
  }
}
