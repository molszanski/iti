// import { Assign } from "utility-types"
import mitt from "mitt"
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

abstract class NodeApi<NodeContext extends object> {
  public helloWorld() {
    return "123"
  }
}

abstract class AbstractNode<NodeContext extends object> {
  public addNode<NewContext extends { [T in keyof NewContext]: NewContext[T] }>(
    newContext: NewContext,
  ): AbstractNode<Assign<NodeContext, NewContext>> {
    return new Node(this, newContext)
  }

  public get<Token extends keyof NodeContext>(
    token: Token,
  ): UnpackFunction<NodeContext[Token]> {
    return this.resolve(token)
  }

  protected abstract resolve<Token extends keyof NodeContext>(
    token: Token,
  ): UnpackFunction<NodeContext[Token]>

  abstract lol<Token extends keyof NodeContext>(token: Token): Token
}

class RootNode extends AbstractNode<{}> {
  public override resolve(token: never): never {
    throw new Error(`nope`)
  }

  public override lol(): never {
    throw new Error(`nope`)
  }
}

// type T1 = "a" | "b"
// type T2 = "b" | "c" | "d"
// type T3 = T1 | T2
// type T4 = Prettify<T3>

class Node<
  ParentNodeContext extends object,
  ThisNodeContext extends object,
> extends AbstractNode<Assign<ParentNodeContext, ThisNodeContext>> {
  private cached: { [K in keyof ThisNodeContext]?: any }

  constructor(
    readonly parent: AbstractNode<ParentNodeContext>,
    readonly thisContext: ThisNodeContext,
  ) {
    super()
    this.cached = {}
  }

  protected override resolve<
    SearchToken extends keyof ThisNodeContext | keyof ParentNodeContext,
  >(
    token: SearchToken,
  ): UnpackFunction<Assign<ParentNodeContext, ThisNodeContext>[SearchToken]> {
    // Type Hack: sorry, don't know how to solve it
    // TODO: Make an issue at a typescript repo
    const thisNodeContext = this.thisContext as any
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
      // Type Hack: sorry, don't know how to solve it
      return this.parent.get(token as any)
    }
  }

  override lol<
    SearchToken extends keyof ThisNodeContext | keyof ParentNodeContext,
  >(token: SearchToken): SearchToken {
    return 1 as SearchToken
  }
}

export function makeRoot() {
  return new RootNode()
}
