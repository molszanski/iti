import { Intersection } from "utility-types"
import { createNanoEvents, Emitter } from "./nanoevents"
import { addGetter, Assign4, UnPromisify } from "./_utils"
import { ItiResolveError, ItiTokenError } from "./errors"
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

export type UnpackFunction<T> = T extends (...args: any) => infer U ? U : T

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
// keep
// type AssignAndUnpackObjects<O1 extends {}, O2 extends {}> = UnpromisifyObject<
//   UnpackObject<Assign4<O1, O2>>
// >

type FullyUnpackObject<T extends {}> = UnpromisifyObject<UnpackObject<T>>

abstract class AbstractNode<Context extends {}> {
  public abstract get<T extends keyof Context>(
    token: T,
  ): UnpackFunction<Context[T]>

  public abstract getTokens<T extends keyof Context>(): { [M in T]: T }
}

type Events<Context> = {
  // Used only in tests for now
  containerUpdated: (payload: {
    key: keyof Context
    newContainer: Context[keyof Context]
  }) => void
  containerUpserted: (payload: {
    key: keyof Context
    newContainer: Context[keyof Context]
  }) => void

  // Older events
  // containerCreated: (payload: {
  //   key: keyof Context
  //   newContainer: Context[keyof Context]
  // }) => void
  // containerRemoved: (payload: { key: keyof Context }) => void
  // containerRequested: (payload: { key: keyof Context }) => void
}

class Node<Context extends {}> extends AbstractNode<Context> {
  private _cache: { [K in keyof Context]?: any } = {}
  public _context: Context = <Context>{}

  /**
   * EventEmitter Logic
   */
  protected ee: Emitter<Events<Context>>
  // public on = this.ee.on
  on<E extends keyof Events<Context>>(event: E, callback: Events<Context>[E]) {
    return this.ee.on(event, callback)
  }

  constructor() {
    super()
    this.ee = createNanoEvents<Events<Context>>()
  }
  public get<SearchToken extends keyof Context>(
    token: SearchToken,
  ): UnpackFunction<Context[SearchToken]> {
    /**
     * FLOW A: We have this is in a current context
     */
    if (token in this._context) {
      // Case 1: If this token was a funtion / provider it might be in a cache
      if (token in this._cache) {
        const cachedValue = this._cache[token]
        return cachedValue
      }

      const storeInCache = (token: SearchToken, v: any) => {
        this._cache[token] = v

        this.ee.emit("containerUpserted", {
          key: token,
          newContainer: v,
        })
      }

      const tokenValue = this._context[token]
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

    throw new ItiResolveError(`Can't find token '${String(token)}' value`)
  }
  protected _updateContext(updatedContext: Context) {
    for (const [token, value] of Object.entries(updatedContext)) {
      if (token in this._context) {
        this.ee.emit("containerUpdated", {
          key: token as any,
          newContainer: value as any,
        })
      }
      // Save state and clear cache
      this._context[token] = value
      delete this._cache[token]

      this.ee.emit("containerUpserted", {
        key: token as any,
        newContainer: value,
      } as any)
    }
  }

  public subscribeToContiner<T extends keyof Context>(
    token: T,
    cb: (err: any, container: UnpackFunction<Context[T]>) => void,
  ): () => void {
    return this.ee.on("containerUpserted", async (ev) => {
      if (token === ev.key) {
        try {
          const data = await this.get(token)
          cb(null, data)
        } catch (error) {
          cb(error, undefined as any)
        }
      }
    })
  }

  public getTokens(): {
    [T in keyof Context]: T
  } {
    let tokens = Object.fromEntries(
      Object.keys(this._context).map((el) => [el, el]),
    ) as any
    return tokens
  }
}

type ReduceToKeys<T extends {}> = { [K in keyof T]: K }
type KeysOrCb<Context extends {}> =
  | Array<keyof Context>
  | ((t: { [K in keyof Context]: K }) => Array<keyof Context>)
type KeysOrCbWIthArg<Context, ARG> = Context | ((t: ARG) => Context)

type MyRecord<O extends {}, T> = {
  [K in keyof O]: T
}
type ContextGetter<Context extends {}> = {
  [CK in keyof Context]: UnpackFunction<Context[CK]>
}

export class NodeApi<Context extends {}> extends Node<Context> {
  constructor() {
    super()
  }

  // SAVE: NewContext extends {! [T in keyof NewContext]: NewContext[T] }
  public upsert<NewContext extends {}>(
    newContext:
      | NewContext
      | ((
          containers: ContextGetter<Context>,
          self: NodeApi<Context>,
        ) => NewContext),
  ): NodeApi<Assign4<Context, NewContext>> {
    let nc =
      typeof newContext === "function"
        ? // @ts-expect-error
          newContext(this.containers, this)
        : newContext
    this._updateContext(nc)
    return this as any
  }

  public add<
    // This "magic" type gives user an Error in an IDE with a helpfull message
    NewContext extends Intersection<
      MyRecord<
        Context,
        "You are overwriting this token. It is not safe. Use an unsafe `upsert` method"
      >,
      NewContext
    >,
  >(
    newContextOrCb:
      | NewContext
      | ((
          containers: ContextGetter<Context>,
          self: NodeApi<Context>,
        ) => NewContext),
  ): NodeApi<Assign4<Context, NewContext>> {
    let newContext =
      typeof newContextOrCb === "function"
        ? newContextOrCb(this.containers, this)
        : newContextOrCb

    // Step 1: Runtime check for existing tokens in context
    var existingTokens = Object.keys(this.getTokens())
    let duplicates = existingTokens.filter((x) => x in newContext)
    if (duplicates.length !== 0) {
      throw new ItiTokenError(
        `Tokens already exist: ['${duplicates.join("', '")}']`,
      )
    }

    // Step 2: If everything is fine add a newContext
    return this.upsert(newContext)
  }

  public _extractTokens<T extends keyof Context>(
    tokensOrCb: KeysOrCb<Context>,
  ): T[] {
    if (typeof tokensOrCb === "function") {
      return tokensOrCb(this.getTokens()) as any
    } else {
      return tokensOrCb as any
    }
  }

  public subscribeToContinerSet<T extends keyof Context>(
    tokensOrCb: KeysOrCb<Context>,
    cb: (
      err: any,
      container: {
        [K in T]: FullyUnpackObject<Context>[K]
      },
    ) => void,
  ): () => void {
    let tokens = this._extractTokens(tokensOrCb)
    return this.ee.on("containerUpserted", async (ev) => {
      if (tokens.includes(ev.key)) {
        try {
          const cSet = await this.getContainerSet(tokens)
          cb(null, cSet)
        } catch (err) {
          cb(err, undefined as any)
        }
      }
    })
  }

  // this can be optimized
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

  /**
   * This is used to get a container from the context.
   * It should always return a promise?
   * But it seems that it is not possible to do that with the current implementation.
   */
  public get containers(): ContextGetter<Context> {
    let containerMap = <ContextGetter<Context>>{}
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
