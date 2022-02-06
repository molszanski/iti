import { Assign4 } from "./library.root-expertiments"

class MicroNode<Context extends object> {
  public n: number
  public keys: Context

  constructor(start = 0, k) {
    this.n = start
    this.keys = k
  }

  public add(inc = 1) {
    this.n = this.n + inc
    return this
  }

  public addNode<M extends object>(node: M): MicroNode<Assign4<Context, M>> {
    this.keys = Object.assign(this.keys, node)
    return this as any
  }

  public addNodeFunction<M extends object>(
    cb: (k: MicroNode<Context>) => M,
  ): MicroNode<Assign4<Context, M>> {
    let n = cb(this)
    this.keys = Object.assign(this.keys, n)
    return this as any
  }

  public print() {
    return this.keys
  }
}

// Here it is in action:

let b = new MicroNode(2, {})
  .addNode({ a: 1, b: 2 })
  .addNode({ c: 1, d: 2 })
  .addNodeFunction((n) => {
    console.log("-->", n.keys.c)q
    return { e: 1 }
  })
  .add(3)
  .add()
  .add(1)
  .print()
// b.
console.log(b)

export const a = 1
// function callWithKeys<
//   Provider extends (...args: any) => any,
//   F extends ReturnType<Provider>,
// >(fn: Provider, keys: any) {
//   console.log("called getKeys: ", keys)
//   // @ts-ignore
//   fn(keys as F)

//   return 1 as any as F
// }

// function mapper<
//   Provider,
//   R extends ReturnType<Provider>
//   M extends keyof R,
// >(fn: Provider) {
//   let k = fn(null)
//   let keys = Object.keys(k)

//   let l = callWithKeys(fn, keys)

//   return 1 as any as M
// }

// let v = mapper((k) => {
//   console.log("called source", k)
//   return { a: 1, b: 2 }
// })
// console.log(v)
