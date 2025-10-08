import { createNanoEvents, Emitter } from "./nanoevents.js"
import {
  addGetter,
  Prettify,
  Assign,
  KeysOrCb,
  ContextGetter,
  UnpackFunction,
  MyRecord,
  FullyUnpackObject,
  _intersectionKeys,
  UnPromisify,
  UnpackFunctionReturn,
} from "./_utils.js"
import { ItiResolveError, ItiTokenError } from "./errors.js"
import type { Intersection } from "utility-types"

abstract class AbstractContainer<Context extends {}> {
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
    newItem: Context[keyof Context]
  }) => void
  containerUpserted: (payload: {
    key: keyof Context
    newContainer: Context[keyof Context] | null
    newItem: Context[keyof Context] | null
  }) => void
  containerDeleted: (payload: { key: keyof Context }) => void
  containerDisposed: (payload: { key: keyof Context }) => void

  // Used only in tests for now
  itemUpdated: (payload: {
    key: keyof Context
    newItem: Context[keyof Context] | null
  }) => void
  itemUpserted: (payload: {
    key: keyof Context
    newItem: Context[keyof Context] | null
  }) => void
  itemDeleted: (payload: { key: keyof Context }) => void
  itemDisposed: (payload: { key: keyof Context }) => void

  // Older events
  // containerCreated: (payload: {
  //   key: keyof Context
  //   newContainer: Context[keyof Context]
  // }) => void
  // containerRemoved: (payload: { key: keyof Context }) => void
  // containerRequested: (payload: { key: keyof Context }) => void
}

class InternalContainer<
  Context extends {},
  DisposeContext extends {},
> extends AbstractContainer<Context> {
  /**
   * When we create a new class instance or function, we cache the output
   */
  private _cache: { [K in keyof Context]?: any } = {}
  private _cacheSync: { [K in keyof Context]?: any } = {}

  /**
   * Holds key:value factories in a form token:factory
   */
  public _context: Context = <Context>{}

  /**
   * Here we hold references to "disposers".
   * A disposer is a function assigned to a token that will be called when
   * `dispose` call is made.
   */
  public _disposeCtx: { [K in keyof DisposeContext]?: any } = {}

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
    this.subscribeToContainer = this.subscribeToItem.bind(this)
  }

  protected _storeInSyncCache(token: keyof Context, v: any) {
    this._cacheSync[token] = v
  }
  protected _storeInCache(token: keyof Context, v: any) {
    this._cache[token] = v

    if (v instanceof Promise) {
      v.then((resolvedValue) => {
        this._storeInSyncCache(token, resolvedValue)
      }).catch((err) => {
        // we should't do anything with an error here
        // because this is our internal cache
        // in userspace he will get __another__ throw error
      })
    }

    /**
     * Not remember why this is here.
     * I think to indicate when we create an instance
     * or cache a function result
     */
    this.ee.emit("containerUpserted", {
      key: token,
      newContainer: v,
      newItem: v,
    })
    this.ee.emit("itemUpserted", {
      key: token,
      newItem: v,
    })
  }

  public get<SearchToken extends keyof Context>(
    token: SearchToken,
  ): UnpackFunction<Context[SearchToken]> {
    /**
     * FLOW A: We have this is in a current context
     */
    if (token in this._context) {
      // Case 1: If this token was a function / provider it might be in a cache
      if (token in this._cache) {
        const cachedValue = this._cache[token]
        return cachedValue
      }

      // Case 2: If this token is a function we must launch and cache it
      const tokenValue = this._context[token]
      if (typeof tokenValue === "function") {
        const providedValue = tokenValue()
        this._storeInCache(token, providedValue)
        return providedValue
      }

      // Case 3: This is a simple literal so we just send it
      this._storeInCache(token, tokenValue) // We store it send events too
      return tokenValue as any
    }

    throw new ItiResolveError(`Can't find token '${String(token)}' value`)
  }

  public getSync<SearchToken extends keyof Context>(
    token: SearchToken,
  ): UnpackFunction<Context[SearchToken]> {
    /**
     * FLOW A: We have this is in a current context
     */
    if (token in this._context) {
      if (token in this._cacheSync) {
        const cachedValue = this._cacheSync[token]
        return cachedValue
      } else {
        return this.get(token)
      }
    }

    throw new ItiResolveError(`Can't find token '${String(token)}' value`)
  }

  public delete<SearchToken extends keyof Context>(
    token: SearchToken,
  ): Container<Omit<Context, SearchToken>, DisposeContext> {
    delete this._context[token]
    delete this._cache[token]
    // There is no need to check for disposer existence, since delete will not throw
    // @ts-expect-error
    delete this._disposeCtx[token]

    this.ee.emit("containerDeleted", {
      key: token as any,
    })
    this.ee.emit("itemDeleted", {
      key: token as any,
    })

    return this as any
  }

  public async dispose<
    DisposeToken extends keyof DisposeContext & keyof Context,
  >(token: DisposeToken): Promise<void> {
    const tokenHasDisposerFn = token in this._disposeCtx
    const tokenHasBeenResolved = token in this._cache

    if (!tokenHasDisposerFn || !tokenHasBeenResolved) return

    const disposerFn = this._disposeCtx[token]

    if (typeof disposerFn === "function") {
      const cachedValue = this._cache[token]
      const cachedValueResolved = await Promise.resolve(cachedValue)

      const disposeResult = disposerFn(cachedValueResolved)

      const cleanup = () => {
        delete this._cache[token]
        this.ee.emit("containerDisposed", { key: token })
        this.ee.emit("itemDisposed", { key: token })
      }
      if (disposeResult instanceof Promise) {
        disposeResult.then(cleanup)
      } else {
        cleanup()
      }
      return disposeResult
    }
  }

  /**
   * Will naively dispose all the containers in the dispose context.
   *
   * It will only dispose values we've touched / created.
   *
   * Always async, because disposing is 95% async anyway
   */
  public async disposeAll() {
    const thingsToDispose = Object.keys(this._disposeCtx).map((token) =>
      this.dispose(token as any),
    )

    // We wait for all the disposers to finish and clear all cache
    await Promise.all(thingsToDispose)
  }

  protected _updateContext(updatedContext: Context) {
    for (const [token, value] of Object.entries(updatedContext)) {
      if (token in this._context) {
        this.ee.emit("containerUpdated", {
          key: token as any,
          newContainer: value as any,
          newItem: value as any,
        })
        this.ee.emit("itemUpdated", {
          key: token as any,
          newItem: value as any,
        })
      }
      // Save state and clear cache
      this._context[token] = value
      delete this._cache[token]
      this.ee.emit("containerUpserted", {
        key: token as any,
        newContainer: value,
        newItem: value,
      } as any)
      this.ee.emit("itemUpserted", {
        key: token as any,
        newItem: value,
      } as any)
    }
  }

  public subscribeToItem<T extends keyof Context>(
    token: T,
    cb: (err: any, container: UnpackFunction<Context[T]>) => void,
  ): () => void {
    const upsertUnsubscribe = this.ee.on("itemUpserted", async (ev) => {
      if (token === ev.key) {
        try {
          const data = await this.get(token)
          cb(null, data)
        } catch (error) {
          cb(error, undefined as any)
        }
      }
    })
    const deleteUnsubscribe = this.ee.on("itemDeleted", async (ev) => {
      if (token === ev.key) {
        cb({ containerRemoved: token, itemRemoved: token }, undefined as any)
      }
    })
    return () => {
      upsertUnsubscribe()
      deleteUnsubscribe()
    }
  }

  /**
   * @deprecated Use `subscribeToItem` instead. This method will be removed in a future version.
   */
  public subscribeToContainer: <T extends keyof Context>(
    token: T,
    cb: (err: any, container: UnpackFunction<Context[T]>) => void,
  ) => () => void

  public getTokens(): {
    [T in keyof Context]: T
  } {
    let tokens = Object.fromEntries(
      Object.keys(this._context).map((el) => [el, el]),
    ) as any
    return tokens
  }
}

export class Container<
  Context extends {},
  DisposeContext extends {},
> extends InternalContainer<Context, DisposeContext> {
  constructor() {
    super()
    this.getContainerSet = this.getItems.bind(this)
    this.subscribeToContainerSet = this.subscribeToItems.bind(this)
  }

  // SAVE: NewContext extends {! [T in keyof NewContext]: NewContext[T] }
  public upsert<NewContext extends {}>(
    newContext:
      | NewContext
      | ((
          containers: ContextGetter<Context>,
          self: Container<Context, DisposeContext>,
        ) => NewContext),
  ): Container<Prettify<Assign<Context, NewContext>>, DisposeContext> {
    let nc =
      typeof newContext === "function"
        ? // @ts-expect-error
          newContext(this.items, this)
        : newContext
    this._updateContext(nc)
    return this as any
  }

  public add<
    // This "magic" type gives user an Error in an IDE with a helpful message
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
          items: ContextGetter<Context>,
          self: Container<Context, DisposeContext>,
        ) => NewContext),
  ): Container<Prettify<Assign<Context, NewContext>>, DisposeContext> {
    let newContext =
      typeof newContextOrCb === "function"
        ? newContextOrCb(this.items, this)
        : newContextOrCb

    // Step 1: Runtime check for existing tokens in context
    const duplicates = _intersectionKeys(newContext, this.getTokens())
    if (duplicates)
      throw new ItiTokenError(`Tokens already exist: ['${duplicates}']`)

    // Step 2: If everything is fine add a newContext
    let m = this.upsert(newContext)
    return m as any
  }
  // {! [T in keyof NewContext]: NewContext[T] }
  public addDisposer<
    NewDisposerContext extends {
      [T in keyof Context]?: (
        cachedValue: UnPromisify<UnpackFunctionReturn<Context[T]>>,
      ) => any
    },
  >(
    newContextOrCb:
      | NewDisposerContext
      | ((
          items: ContextGetter<Context>,
          self: Container<Context, DisposeContext>,
        ) => NewDisposerContext),
  ): Container<Context, Assign<DisposeContext, NewDisposerContext>> {
    let newDisposingCtx =
      typeof newContextOrCb === "function"
        ? newContextOrCb(this.items, this)
        : newContextOrCb

    // Step 1: Runtime check for existing tokens in a Dispose Context
    const duplicates = _intersectionKeys(newDisposingCtx, this._disposeCtx)
    if (duplicates)
      throw new ItiTokenError(`Tokens already exist: ['${duplicates}']`)

    // Step 2: Add disposer context
    for (const [token, value] of Object.entries(newDisposingCtx)) {
      this._disposeCtx[token] = value
    }

    return this as any
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

  public subscribeToItems<T extends (keyof Context)[]>(
    tokensOrCb: T | ((t: { [K in keyof Context]: K }) => T),
    cb: (
      err: any,
      container: {
        [K in T[number]]: FullyUnpackObject<Context>[K]
      },
    ) => void,
  ): () => void {
    let tokens = this._extractTokens(tokensOrCb)
    const upsertUnsubscribe = this.ee.on("itemUpserted", async (ev) => {
      if (tokens.includes(ev.key)) {
        try {
          const cSet = await this.getItems(tokens)
          cb(null, cSet)
        } catch (err) {
          cb(err, undefined as any)
        }
      }
    })
    const deleteUnsubscribe = this.ee.on("itemDeleted", async (ev) => {
      if (tokens.includes(ev.key)) {
        cb({ containerRemoved: ev.key, itemRemoved: ev.key }, undefined as any)
      }
    })
    return () => {
      upsertUnsubscribe()
      deleteUnsubscribe()
    }
  }

  public getItemsSync<T extends keyof Context>(
    tokensOrCb: KeysOrCb<Context>,
  ):
    | Promise<{
        [K in T]: FullyUnpackObject<Context>[K]
      }>
    | {
        [K in T]: FullyUnpackObject<Context>[K]
      } {
    let tokens: T[] = this._extractTokens(tokensOrCb)

    let itemDecoratedMap = {} as any

    // Step 1: Assign all values
    let hasAnyPromise = false
    tokens.forEach((token) => {
      const value = this.getSync(token)
      itemDecoratedMap[token as any] = value
      if (value instanceof Promise) {
        hasAnyPromise = true
      }
    })

    if (hasAnyPromise) {
      return this.getItems(tokensOrCb)
    }

    return itemDecoratedMap
  }

  /**
   * Gets multiple items from the container by their tokens.
   * Handles both synchronous and asynchronous values properly.
   */
  public async getItems<T extends (keyof Context)[]>(
    tokensOrCb: T | ((t: { [K in keyof Context]: K }) => T),
  ): Promise<{
    [K in T[number]]: FullyUnpackObject<Context>[K]
  }> {
    let tokens: T = this._extractTokens(tokensOrCb) as any
    let promiseTokens: any = []
    let allPromises: any = []
    for (let token of tokens) {
      if (this.items[token] instanceof Promise) {
        promiseTokens.push(token)
        allPromises.push(this.items[token])
      }
    }

    let itemDecoratedMap: {
      [K in T[number]]: FullyUnpackObject<Context>[K]
    } = {} as any

    // Step 1: Assign all values
    tokens.forEach((token) => {
      itemDecoratedMap[token as any] = this.items[token]
    })

    // Step 2: Overwrite Promise like values with promise results
    const rez = await Promise.all(allPromises)
    promiseTokens.forEach((token, index) => {
      itemDecoratedMap[token] = rez[index]
    })

    return itemDecoratedMap
  }

  public get items(): ContextGetter<Context> {
    let itemMap = <ContextGetter<Context>>{}
    for (let key in this.getTokens()) {
      addGetter(itemMap, key, () => {
        return this.get(key as any)
      })
    }
    return itemMap
  }

  /**
   * This is used to get a container from the context.
   * It should always return a promise?
   * But it seems that it is not possible to do that with the current implementation.
   * @deprecated
   */
  public get containers() {
    return this.items
  }

  /**
   * @deprecated Use `getItems` instead. This method will be removed in a future version.
   */
  public getContainerSet: <T extends (keyof Context)[]>(
    tokensOrCb: T | ((t: { [K in keyof Context]: K }) => T),
  ) => Promise<{ [K in T[number]]: FullyUnpackObject<Context>[K] }>

  /**
   * @deprecated Use `subscribeToItems` instead. This method will be removed in a future version.
   */
  public subscribeToContainerSet: <T extends (keyof Context)[]>(
    tokensOrCb: T | ((t: { [K in keyof Context]: K }) => T),
    cb: (
      err: any,
      container: {
        [K in T[number]]: FullyUnpackObject<Context>[K]
      },
    ) => void,
  ) => () => void
}

export function createContainer() {
  return new Container()
}
