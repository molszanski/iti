// import { Assign } from "utility-types"
import mitt from "mitt"
import { SnowSplashResolveError } from "./library.new-root-errors"
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

class Node<ParentNodeContext extends object, ThisNodeContext extends object> {
  private cached: { [K in keyof ThisNodeContext]?: any }

  constructor(
    protected readonly parentNode: Node<ParentNodeContext, {}> | null,
    protected readonly providedContext: ThisNodeContext,
  ) {
    this.cached = {}
  }

  protected resolve<
    SearchToken extends keyof ThisNodeContext | keyof ParentNodeContext,
  >(
    token: SearchToken,
  ): UnpackFunction<Assign<ParentNodeContext, ThisNodeContext>[SearchToken]> {
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
        return this.parentNode.resolve(token as any)
      } else {
        throw new SnowSplashResolveError(`Could not resolve value for ${token}`)
      }
    }
  }

  public getTokens(): {
    [T in keyof ParentNodeContext | keyof ThisNodeContext]: T
  } {
    let tokens = this.myTokens()
    if (this.parentNode == null) {
      return this.myTokens()
    }
    return Object.assign(tokens, this.parentNode.getTokens())
  }

  /**
   * { a: 1, b: "b" } => { a: "a", b: "b" }
   * @returns
   */
  private myTokens(): {
    [T in keyof ParentNodeContext | keyof ThisNodeContext]: T
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
    protected readonly parentNode: NodeApi<
      ParentNodeContext,
      ThisNodeContext
    > | null,
    protected readonly providedContext: ThisNodeContext,
  ) {
    super(parentNode, providedContext)
  }

  public addNode<NewContext extends { [T in keyof NewContext]: NewContext[T] }>(
    newContext: NewContext,
  ): NodeApi<ThisNodeContext, NewContext> {
    return new NodeApi(this as any, newContext)
  }

  public get<
    SearchToken extends keyof ThisNodeContext | keyof ParentNodeContext,
  >(token: SearchToken) {
    return this.resolve(token)
  }
}

export function makeRoot() {
  const lol = new NodeApi(null, {})
  return lol
}
