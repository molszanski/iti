import { Assign4 } from "./_utils"

class Store<Context extends {}> {
  public _context: Context = <Context>{}

  public do<A extends any[], R>(
    action: (_this: Store<Context>, ...args: A) => R,
    ...args: A
  ): R {
    return action(this, ...args)
  }
}

function upsert3333<Context extends {}, NewContext extends {}>(
  _this: Store<Context>,
  newContext: NewContext,
): Store<Assign4<Context, NewContext>> {
  Object.assign(_this, newContext)
  return _this as any
}
function getTokens333<Context>(_this: Store<Context>): {
  [T in keyof Context]: T
} {
  let tokens = Object.fromEntries(
    Object.keys(_this._context).map((el) => [el, el]),
  ) as any
  return tokens
}

const store = new Store()
const store2 = store.do(upsert3333, { k: 11 })
const tokss1 = store2.do(getTokens333)
const store3 = store2.do(upsert3333, { b4: 33 })
const store4 = store3.do(upsert3333, { a: 1, b: true })
const tokss5 = store4.do(getTokens333)

console.log("tokss1", tokss1)
console.log("tokss5", tokss5)
