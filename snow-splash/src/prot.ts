// type Without<T, U> = T extends U ? never : T
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type Assign<OldContext extends {}, NewContext extends {}> = {
  [Token in keyof OldContext | keyof NewContext]: Token extends keyof NewContext
    ? NewContext[Token]
    : Token extends keyof OldContext
    ? OldContext[Token]
    : never
}

type T1 = { a: number; b: string }
type T2 = { b: boolean }
type T3 /** { a: number; b: boolean; } */ = Assign<T1, T2>

class Store<Context extends {}> {
  constructor(public state: Context = <Context>{}) {}

  public add<AdditionalState extends {}>(
    s: AdditionalState,
  ): Store<Assign<Context, AdditionalState>> {
    const newState = Object.assign(this.state, s)

    return new Store(newState as any)
  }

  public addSafe<AdditionalState extends Exclude<{}, Context>>(
    s: AdditionalState,
  ): Store<Assign<Context, AdditionalState>> {
    const newState = Object.assign(this.state, s)
    return new Store(newState as any)
  }
}

const t0 = new Store()

let t1 /** { a: number;  } */ = t0.add({ a: 1 })
let t2 /** { a: number; b: boolean; } */ = t1.add({ b: true })
let t3 /** { a: string; b: boolean; } */ = t2.add({ a: "oops" })

let t4 /** { a: string; b: boolean; } */ = t1.addSafe({ a: "oops" })
let t5 /** { a: string; b: boolean; } */ = t0.addSafe({ a: "oops" }) // Err

export const a = 1
