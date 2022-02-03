import { Assign } from "utility-types"

type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

/**
 * Can we add same tokens? Should the last be resolved? Both?
 *
 */
type ExtendObjectt<
  OldContext extends {},
  newToken extends string,
  newTokenType,
> = OldContext & { [NT in newToken]: newTokenType }
declare function extend<Context extends {}, Token extends string, newType>(
  context: Context,
  token: Token,
  type: newType,
): ExtendObjectt<Context, Token, newType>

const first = {
  a: 1,
  b: "strs",
}

let e1 = extend(first, "c", "num")
type e1 = Prettify<typeof e1>

let e2 = extend(first, "d", 123)
type e2 = Prettify<typeof e2>

let e3 = extend(first, "d", () => 123)
type e3 = Prettify<typeof e3>

console.log(e1, e2, e3)

// Extend objects -------------------

// type ExtendObjectt2<OldContext extends {}, NewContext extends {}> = {
//   [Token in keyof (OldContext &
//     NewContext)]: Token extends keyof OldContext
//     ? OldContext[Token]
//     : Token extends keyof NewContext
//     ? NewContext[Token]
//     : never
// }

// _.assign      ({ a: 'a' }, { a: 'bb' }) // => { a: "bb" }
// _.defaults    ({ a: 'a' }, { a: 'bb' }) // => { a: "a"  }
// Extend
type ExtendObjecttDefaults<
  OldContext extends object,
  NewContext extends object,
> = {
  [Token in keyof (OldContext & {
    [NT in keyof NewContext]: never
  })]: Token extends keyof OldContext
    ? OldContext[Token]
    : Token extends keyof NewContext
    ? NewContext[Token]
    : never
}

type C1 = { a: 1; b: "2" }
type C2 = { b: 1; d: "2" }

type M = ExtendObjecttDefaults<C1, C2>
type full = Prettify<M>
let a333: full = 1 as any
console.log(a333)

///----

type Point = { x: number; y: number }
type Point2 = { x: number; b: number }
type P = keyof Point | keyof Point2
type full23 = Prettify<P>
/// T2
// _.assign      ({ a: 'a' }, { a: 'bb' }) // => { a: "bb" }
// _.defaults    ({ a: 'a' }, { a: 'bb' }) // => { a: "a"  }
// ASSIGN
type ExtendObjecttAssign<
  OldContext extends object,
  NewContext extends object,
> = {
  [Token in keyof OldContext | keyof NewContext]: Token extends keyof NewContext
    ? NewContext[Token]
    : Token extends keyof OldContext
    ? OldContext[Token]
    : never
}

type A1 = { a: 1; b: "2" }
type A2 = { b: 2; c: "3" }

type M2 = ExtendObjecttAssign<A1, A2>
type full2 = Prettify<M2>

let a444: full2 = 1 as any
console.log(a444)

// lib
// https://github.com/piotrwitek/utility-types#assignt-u
type M3 = Assign<A1, A2>
type full3 = Prettify<M3>
let a555: full3 = 1 as any
console.log(a555)

// declare function extend<Context extends {}, Token extends string, newType>(
//   context: Context,
//   token: Token,
//   type: newType,
// ): ExtendObjectt2<Context, Token, newType>

// const first2 = {
//   a: 1,
//   b: "strs",
// }

// let ee1 = extend(first, "c", "num")
// type ee1 = Prettify<typeof ee1>

// let ee2 = extend(first, "d", 123)
// type ee2 = Prettify<typeof ee2>

// let ee3 = extend(first, "d", () => 123)
// type ee3 = Prettify<typeof ee3>

// console.log(ee1, ee2, ee3)

//
//
//
//
// Stop

export const a = { a: 1 }