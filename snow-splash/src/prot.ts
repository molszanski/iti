import { Assign, Subtract, Diff, Intersection } from "utility-types"
// type Without<T, U> = T extends U ? never : T
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

// type Assign<OldContext extends {}, NewContext extends {}> = {
//   [Token in keyof OldContext | keyof NewContext]: Token extends keyof NewContext
//     ? NewContext[Token]
//     : Token extends keyof OldContext
//     ? OldContext[Token]
//     : never
// }
type Merge<O1 extends {}, O2 extends {}> = Prettify<Assign<O1, O2>>

type T1 = { a: number; b: string }
type T2 = { b: boolean }
type T3 /** { a: number; b: boolean; } */ = Assign<T1, T2>
type NotNoDistribute<T, U> = [T] extends [U] ? never : T

type Z = Exclude<T1, T2>

type Inter<O1, O2> = {
  [Token in keyof O1 | keyof O2]: Token extends keyof O1 & keyof O2
    ? O1[Token]
    : never
}
type M33 = Inter<T1, T2>

export type MyExclude<OldContext extends object, NewContext extends object> = {
  [Token in keyof (
    | {
        [K in keyof OldContext]: OldContext[K]
      }
    | {
        [M in keyof NewContext]: NewContext[M]
      }
  )]: Token extends keyof NewContext
    ? NewContext[Token]
    : Token extends keyof OldContext
    ? OldContext[Token]
    : never
}

type Z2 = Subtract<T1, T2>
// let a222: Z2 = { a: 1 }

class Store<Context extends {}> {
  constructor(public state: Context = <Context>{}) {}

  public add<AdditionalState extends {}>(
    s: AdditionalState,
  ): Store<Merge<Context, AdditionalState>> {
    const newState = Object.assign(this.state, s)

    return new Store(newState as any)
  }

  public addSafe<
    AdditionalState extends Intersection<Context, AdditionalState>,
  >(s: AdditionalState): Store<Merge<Context, AdditionalState>> {
    const newState = Object.assign(this.state, s)
    return new Store(newState as any)
  }
}

const t0 = new Store()

let t1 /** { a: number;  } */ = t0.add({ a: 1 })
let t2 /** { a: number; b: boolean; } */ = t1.add({ b: true })
let t3 /** { a: string; b: boolean; } */ = t2.add({ a: "oops" })

let t4 /** { a: string; b: boolean; } */ = t0.addSafe({ c: "oops" })
let t5 /** { a: string; b: boolean; } */ = t2.addSafe({ a: "oops", d: 4 }) // Err

export const a = 1

type A = "a" | "b" | "c"
type B = "c" | "d" | "e"

type NotNoDistribute2<T, U> = [T] extends [U] ? never : T
type not_A_B_2 = NotNoDistribute2<A, B> // 'a' | 'b' | 'c'
