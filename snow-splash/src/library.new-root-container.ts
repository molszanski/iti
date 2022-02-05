// import { Assign } from "utility-types"
import mitt from "mitt"
import { UnPromisify } from "."
import { SnowSplashResolveError } from "./library.new-root-errors"
import { Assign4 } from "./library.root-expertiments"
import { addGetter } from "./_utils"
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never
type Assign<OldContext extends object, NewContext extends object> = {
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

type AssignAndUnpack<O1 extends object, O2 extends object> = UnpromisifyObject<
  UnpackObject<Assign4<O1, O2>>
>

abstract class AbstractNode<Context extends object> {
  // public addNode<NewContext extends { [T in keyof NewContext]: NewContext[T] }>(
  //   newContext: NewContext,
  // ): NodeApi<Context, NewContext> {
  //   return new NodeApi(this, newContext)
  // }

  public abstract get<T extends keyof Context>(
    token: T,
  ): UnpackFunction<Context[T]>

  public abstract getTokens<T extends keyof Context>(): { [M in T]: T }
}

class Node<
  ParentNodeContext extends object,
  ThisNodeContext extends object,
> extends AbstractNode<Assign4<ParentNodeContext, ThisNodeContext>> {
  private cached: { [K in keyof ThisNodeContext]?: any }

  constructor(
    private readonly parentNode: AbstractNode<ParentNodeContext> | null,
    private readonly providedContext: ThisNodeContext,
  ) {
    super()
    this.cached = {}
  }

  public get<
    SearchToken extends keyof ({
      [K in keyof ParentNodeContext]: ParentNodeContext[K]
    } & {
      [K in keyof ThisNodeContext]: ThisNodeContext[K]
    }),
  >(
    token: SearchToken,
  ): UnpackFunction<Assign4<ParentNodeContext, ThisNodeContext>[SearchToken]> {
    // Type Hack: sorry, don't know how to solve it
    // TODO: Make an issue at a typescript repo
    const thisNodeContext = this.providedContext as any
    if (thisNodeContext[token] != null) {
      // Type Hack: sorry, don't know how to solve it
      let thisNodeToken = token as any as keyof ThisNodeContext

      // Case 1: If this token was a funtion / provider it might be in a cache
      const cachedValue = this.cached[thisNodeToken]
      if (cachedValue != null) {
        return cachedValue
      }

      const tokenValue = thisNodeContext[token]

      // Case 2: If this token is a function we must launch and cache it
      if (typeof tokenValue === "function") {
        const providedValue = tokenValue()
        this.cached[thisNodeToken] = providedValue
        return providedValue
      }

      // Case 3: This is a simple literal so we just send it
      return tokenValue
    } else {
      if (this.parentNode != null) {
        // Type Hack: sorry, don't know how to solve it
        return this.parentNode.get(token as any)
      } else {
        throw new SnowSplashResolveError(`Could not resolve value for ${token}`)
      }
    }
  }

  public getTokens(): {
    [T in keyof ParentNodeContext | keyof ThisNodeContext]: T
  } {
    let tokens = this.myTokens() as any
    if (this.parentNode == null) {
      return tokens
    }
    return Object.assign(tokens, this.parentNode.getTokens())
  }

  /**
   * { a: 1, b: "b" } => { a: "a", b: "b" }
   * @returns
   */
  private myTokens(): {
    [T in keyof ThisNodeContext]: T
  } {
    let tokens = Object.fromEntries(
      Object.keys(this.providedContext).map((el) => [el, el]),
    ) as any
    return tokens
  }
}

class NodeApi<
  ParentNodeContext extends object,
  ThisNodeContext extends object,
> extends Node<ParentNodeContext, ThisNodeContext> {
  constructor(
    parentNode: Node<{}, ParentNodeContext> | null,
    providedContext: ThisNodeContext,
  ) {
    super(parentNode, providedContext)
  }

  public addNode<NewContext extends { [T in keyof NewContext]: NewContext[T] }>(
    newContext: NewContext,
  ): NodeApi<ThisNodeContext, NewContext> {
    return new NodeApi(this as any, newContext)
  }

  public getViaCb<T extends keyof Assign4<ParentNodeContext, ThisNodeContext>>(
    cb: (keyMap: {
      [T in keyof Assign4<ParentNodeContext, ThisNodeContext>]: T
    }) => T,
  ) {
    let searchedToken = cb(this.getTokens())
    return this.get(searchedToken)
  }
  // public get<T extends keyof Assign4<ParentNodeContext, ThisNodeContext>>(
  //   t: T,
  // ) {
  //   return super.get(t)
  // }

  /**
   * We can actually extract this into a wrapper class
   */
  public async getContainerSet<
    T extends keyof Assign4<ParentNodeContext, ThisNodeContext>,
  >(tokens: T[]) {
    let promiseTokens: T[] = []
    let allPromises: any = []
    for (let token of tokens) {
      if (this.containers[token] instanceof Promise) {
        promiseTokens.push(token)
        allPromises.push(this.containers[token])
      }
    }

    let containerDecoratedMap: {
      [K in T]: AssignAndUnpack<ParentNodeContext, ThisNodeContext>[K]
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
      [CK in keyof Assign4<ParentNodeContext, ThisNodeContext>]: Assign4<
        ParentNodeContext,
        ThisNodeContext
      >[CK]
    }
    let containerMap = <ContainerGetter>{}
    for (let key in this.getTokens()) {
      addGetter(containerMap, key, () => this.get(key as any))
    }
    return containerMap
  }
}

export function makeRoot() {
  const lol = new NodeApi(null, {})
  return lol
}
