import mitt from "mitt"
import { createNanoEvents } from "./ee/ee"
import { UnPromisify } from "."
import { SnowSplashResolveError } from "./library.new-root-errors"
import { Assign4 } from "./library.root-expertiments"
import { addGetter } from "./_utils"
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never
type Assign<OldContext extends {}, NewContext extends {}> = {
  [Token in keyof OldContext | keyof NewContext]: Token extends keyof NewContext
    ? NewContext[Token]
    : Token extends keyof OldContext
    ? OldContext[Token]
    : never
}

type UnpackFunction<T> = T extends (...args: any) => infer U ? U : T

type T1 = UnpackFunction<() => string>
type T2 = UnpackFunction<number>

type UnpackObject<T> = {
  [K in keyof T]: UnpackFunction<T[K]>
}

type T3 = UnpackObject<{ a: 1; b: 2 }>
type T4 = UnpackObject<{ a: 1; b: () => Promise<3> }>

type UnpromisifyObject<T> = {
  [K in keyof T]: UnPromisify<T[K]>
}

type AssignAndUnpackObjects<O1 extends {}, O2 extends {}> = UnpromisifyObject<
  UnpackObject<Assign4<O1, O2>>
>

type FullyUnpackObject<T extends {}> = UnpromisifyObject<UnpackObject<T>>

abstract class AbstractNode<Context extends {}> {
  // public addNode<NewContext extends { [T in keyof NewContext]: NewContext[T] }>(
  //   newContext: NewContext,
  // ): NodeApi<Context, NewContext> {
  //   return new NodeApi(this, newContext)
  // }

  public abstract get<T extends keyof Context>(
    token: T,
  ): Promise<UnpackFunction<Context[T]>>

  public abstract getTokens<T extends keyof Context>(): { [M in T]: T }
}

class Node<Context extends {}> extends AbstractNode<Context> {
  private cached: { [K in keyof Context]?: any }
  protected promisedContext: Array<(c: NodeApi<Context>) => Promise<any>> = []
  public context: Context = <Context>{}

  /**
   * EventEmitter Logic
   */
  protected ee = createNanoEvents<{
    containerCreated: (payload: {
      key: keyof Context
      newContainer: Context[keyof Context]
    }) => void
    containerRemoved: (payload: { key: keyof Context }) => void
    containerUpdated: (payload: { key: keyof Context }) => void
    containerRequested: (payload: { key: keyof Context }) => void
  }>()

  constructor() {
    super()
    this.cached = {}
  }
  public async get<
    SearchToken extends keyof {
      [K in keyof Context]: Context[K]
    },
  >(token: SearchToken): Promise<UnpackFunction<Context[SearchToken]>> {
    /**
     * This might be controversial, but this will greatly simplify
     * mental modal for the userland code.
     * This might create an issue if antipattern is used, but it will
     * clear so many other potentiall issues for users
     */
    await this.seal()

    /**
     * FLOW A: We have this is in a current context
     */
    if (this.context[token] != null) {
      // Case 1: If this token was a funtion / provider it might be in a cache
      const cachedValue = this.cached[token]
      if (cachedValue != null) {
        return cachedValue
      }

      const storeInCache = (token: SearchToken, v: any) => {
        this.cached[token] = v
        this.ee.emit("containerCreated", {
          key: token,
          newContainer: v,
        })
      }

      const tokenValue = this.context[token]
      // console.log("tok", token, typeof tokenValue, tokenValue)
      // Case 2: If this token is a function we must launch and cache it
      if (typeof tokenValue === "function") {
        const providedValue = tokenValue()
        storeInCache(token, providedValue)
        return providedValue
      }

      // Case 3: This is a simple literal so we just send it
      storeInCache(token, tokenValue) // We store it send events too
      return tokenValue as any
    }

    throw new SnowSplashResolveError(`Could not resolve value for ${token}`)
  }
  protected updateContext(updatedContext: Context) {
    for (const [token, value] of Object.entries(updatedContext)) {
      if (this.context[token] != null) {
        this.ee.emit("containerUpdated", { key: token as any })
      }
      // Save state and clear cache
      this.context[token] = value
      this.cached[token] = null
    }
  }

  private sealLock: boolean = false
  public seal(): Promise<NodeApi<Context>> {
    return new Promise(async (resolve, reject) => {
      if (this.sealLock === true) {
        let me = this as any as NodeApi<Context>
        resolve(me)
      } else {
        this.sealLock = true
        let sealRecursive = async (err: any) => {
          let node = this.promisedContext.shift()
          if (node == null) {
            let me = this as any as NodeApi<Context>
            this.sealLock = false
            resolve(me)
          } else {
            node(this as any).then((context) => {
              Object.assign(this.context, context)
              sealRecursive(null)
            })
          }
        }
        sealRecursive(null)
      }
    })
  }

  public subscribeToContiner<T extends keyof Context>(
    token: T,
    cb: (container: UnpackFunction<Context[T]>) => void,
  ): () => void {
    return this.ee.on("containerCreated", async (ev) => {
      if (token === ev.key) {
        cb(await this.get(token))
      }
    })
  }

  public getTokens(): {
    [T in keyof Context]: T
  } {
    let tokens = Object.fromEntries(
      Object.keys(this.context).map((el) => [el, el]),
    ) as any
    return tokens
  }
}

type ReduceToKeys<T extends {}> = { [K in keyof T]: K }
type KeysOrCb<Context extends {}> =
  | Array<keyof Context>
  | ((t: { [K in keyof Context]: K }) => Array<keyof Context>)
type KeysOrCbWIthArg<Context, ARG> = Context | ((t: ARG) => Context)

class NodeApi<Context extends {}> extends Node<Context> {
  constructor() {
    super()
  }

  // SAVE: NewContext extends {! [T in keyof NewContext]: NewContext[T] }
  public addNode<NewContext extends {}>(
    newContext: NewContext | ((self: NodeApi<Context>) => NewContext),
  ): NodeApi<Assign4<Context, NewContext>> {
    // @ts-expect-error
    let nc = typeof newContext === "function" ? newContext(this) : newContext
    this.updateContext(nc)
    return this as any
  }

  public addPromise<NewContext extends {}>(
    cb: (self: NodeApi<Context>) => Promise<NewContext>,
  ): NodeApi<Assign4<Context, NewContext>> {
    this.promisedContext.push(cb)
    return this as any
  }

  private _extractTokens<T extends keyof Context>(
    tokensOrCb: KeysOrCb<Context>,
  ): T[] {
    let tokens = tokensOrCb
    if (typeof tokensOrCb === "function") {
      tokens = tokensOrCb(this.getTokens())
    } else {
      tokens = tokensOrCb
    }
    return tokens as any
  }

  public subscribeToContinerSet<T extends keyof Context>(
    tokensOrCb: KeysOrCb<Context>,
    cb: (container: {
      [K in T]: FullyUnpackObject<Context>[K]
    }) => void,
  ): () => void {
    let tokens = this._extractTokens(tokensOrCb)
    return this.ee.on("containerCreated", async (ev) => {
      if (tokens.includes(ev.key)) {
        cb(await this.getContainerSet(tokens))
      }
    })
  }

  /**
   * We can actually extract this into a wrapper class
   */
  public async getContainerSet<T extends keyof Context>(
    tokensOrCb: KeysOrCb<Context>,
  ) {
    let tokens: T[] = this._extractTokens(tokensOrCb)
    let promiseTokens: T[] = []
    let allPromises: any = []
    for (let token of tokens) {
      if (this.containers[token] instanceof Promise) {
        promiseTokens.push(token)
        allPromises.push(this.containers[token])
      }
    }

    let containerDecoratedMap: {
      [K in T]: FullyUnpackObject<Context>[K]
    } = {} as any

    // Step 1: Assign all values
    tokens.forEach((token) => {
      containerDecoratedMap[token as any] = this.containers[token]
    })

    // Step 2: Overwrite Promise like values with promise results
    const rez = await Promise.all(allPromises)
    promiseTokens.forEach((token, index) => {
      containerDecoratedMap[token] = rez[index]
    })

    return containerDecoratedMap
  }

  public get containers() {
    type ContainerGetter = {
      [CK in keyof Context]: Context[CK]
    }
    let containerMap = <ContainerGetter>{}
    for (let key in this.getTokens()) {
      addGetter(containerMap, key, () => {
        return this.get(key as any)
      })
    }
    return containerMap
  }
}

export function makeRoot() {
  const lol = new NodeApi()
  return lol
}
