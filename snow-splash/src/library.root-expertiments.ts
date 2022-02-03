type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

/**
 * Can we add same tokens? Should the last be resolved? Both?
 *
 */
type ExtendContext<
  OldContext extends {},
  newToken extends string,
  newTokenType,
> = OldContext & { [NT in newToken]: newTokenType }

const first = {
  a: 1,
  b: "strs",
}

declare function extend<Context extends {}, Token extends string, newType>(
  context: Context,
  token: Token,
  type: newType,
): ExtendContext<Context, Token, newType>

let e1 = extend(first, "c", "num")
type e1 = Prettify<typeof e1>

let e2 = extend(first, "d", 123)
type e2 = Prettify<typeof e2>

let e3 = extend(first, "d", () => 123)
type e3 = Prettify<typeof e3>

console.log(e1, e2, e3)
//
//
//
//
// Stop

export const a = { a: 1 }
