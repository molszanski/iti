import { Intersection } from "utility-types"
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type Assign<OldContext extends {}, NewContext extends {}> = {
  [Token in keyof OldContext | keyof NewContext]: Token extends keyof NewContext
    ? NewContext[Token]
    : Token extends keyof OldContext
    ? OldContext[Token]
    : never
}
type Merge<O1 extends {}, O2 extends {}> = Prettify<Assign<O1, O2>>

type T1 = { a: number; b: string }
type T2 = { b: boolean }
type T3 /** { a: number; b: boolean; } */ = Assign<T1, T2>

type MyRecord<O extends {}, T> = {
  [K in keyof O]: T
}
class Store<Context extends {}> {
  constructor(public state: Context = <Context>{}) {}

  public addUnsafe<AdditionalState extends {}>(
    s: AdditionalState,
  ): Store<Merge<Context, AdditionalState>> {
    const newState = Object.assign(this.state, s)

    return new Store(newState as any)
  }

  public add<
    AdditionalState extends Intersection<
      MyRecord<
        Context,
        "You are overwriting this key. It is not safe. Use another addUnsafe method"
      >,
      AdditionalState
    >,
  >(s: AdditionalState): Store<Merge<Context, AdditionalState>> {
    // if(Object.keys()this.state)
    const newState = Object.assign(this.state, s)
    return new Store(newState as any)
  }
}

const t0 = new Store()

let t1 /** { a: number;  } */ = t0.add({ a: 1 })
let t2 /** { a: number; b: boolean; } */ = t1.add({ b: true })

// (property) a: "You are overwriting this key. It is not safe. Use another addUnsafe method"
// Type 'number' is not assignable to type
// '"You are overwriting this key. It is not safe. Use another addUnsafe method"'.ts(2322)
// @ts-ignore
let t3 /** { a: string; b: boolean; } */ = t2.add({ a: 123 })
let t5 /** { a: string; b: boolean; } */ = t2.addUnsafe({ a: 123, c: "4" }) // Type 'number' is not assignable to type 'never'.ts(2322)
// Type 'number' is not assignable to type '"you are overwriting the token, this is not safe"'

export const a = 1

type A = "a" | "b" | "c"
type B = "c" | "d" | "e"

type NotNoDistribute2<T, U> = [T] extends [U] ? never : T
type not_A_B_2 = NotNoDistribute2<A, B> // 'a' | 'b' | 'c'
