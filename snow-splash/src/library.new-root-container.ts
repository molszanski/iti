// import { Assign } from "utility-types"
import mitt from "mitt"
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

type AssignAndUnpack<O1 extends {}, O2 extends {}> = UnpromisifyObject<
  UnpackObject<Assign4<O1, O2>>
>

abstract class AbstractNode<Context extends {}> {
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

class Node<Context extends {}> extends AbstractNode<Context> {
  private cached: { [K in keyof Context]?: any }
  protected promisedContext: Promise<any>[] = []
  public mergedContext: Context = <Context>{}
  public providedContext: Context = <Context>{}

  constructor() {
    super()
    this.cached = {}
  }

  public get<
    SearchToken extends keyof {
      [K in keyof Context]: Context[K]
    },
  >(token: SearchToken): UnpackFunction<Context[SearchToken]> {
    // Type Hack: sorry, don't know how to solve it
    // TODO: Make an issue at a typescript repo
    const thisNodeContext = this.providedContext as any
    if (thisNodeContext[token] != null) {
      // Type Hack: sorry, don't know how to solve it
      let thisNodeToken = token as any as keyof Context

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
    }
    throw new SnowSplashResolveError(`Could not resolve value for ${token}`)
  }

  public getTokens(): {
    [T in keyof Context]: T
  } {
    let tokens = Object.fromEntries(
      Object.keys(this.mergedContext).map((el) => [el, el]),
    ) as any
    return tokens
  }
}

class NodeApi<Context extends {}> extends Node<Context> {
  constructor() {
    super()
  }

  public addNode<NewContext extends { [T in keyof NewContext]: NewContext[T] }>(
    newContext: NewContext,
  ): NodeApi<Assign4<Context, NewContext>> {
    Object.assign(this.mergedContext, newContext)
    Object.assign(this.providedContext, newContext)
    return this as any
  }

  public addSuperNode<
    NewContext extends { [T in keyof NewContext]: NewContext[T] },
  >(cb: (self: NodeApi<Context>) => NewContext) {
    let newContext = cb(this)
    return this.addNode(newContext)
  }

  public addPromise<
    NewContext extends { [T in keyof NewContext]: NewContext[T] },
  >(
    cb: (self: NodeApi<Context>) => Promise<NewContext>,
  ): NodeApi<Assign4<Context, NewContext>> {
    let r = cb(this)
    if (r instanceof Promise) {
      this.promisedContext.push(r)
    }
    return this as any
  }

  /**
   * Warning both getPromisesRecursive and setPromisesRecursive
   */
  // private getPromisesRecursive(p: Promise<any>[]) {
  //   if (this.parentNode == null) {
  //     return p
  //   }
  //   if (this.promisedContext != null) {
  //     p.push(this.promisedContext)
  //   }
  //   // @ts-ignore
  //   return this.parentNode.getPromisesRecursive(p)
  // }
  // private setPromisesRecursive(p: any[]) {
  //   if (this.parentNode == null) {
  //     return
  //   }
  //   // Here is some magic. We rely on order of nodes, so this works
  //   if (this.promisedContext != null) {
  //     this.providedContext = p[p.length - 1]
  //     p.pop()
  //   }
  //   // @ts-ignore
  //   return this.parentNode.setPromisesRecursive(p)
  // }

  public async seal<
    NewContext extends { [T in keyof NewContext]: NewContext[T] },
  >(): Promise<NodeApi<Context>> {
    const promises = this.promisedContext
    const lol = await Promise.all(promises)

    lol.forEach((el) => {
      this.addNode(el)
    })

    return this
  }

  // public getViaCb<T extends keyof Assign4<ParentNodeContext, ThisNodeContext>>(
  //   cb: (keyMap: {
  //     [T in keyof Assign4<ParentNodeContext, ThisNodeContext>]: T
  //   }) => T,
  // ) {
  //   let searchedToken = cb(this.getTokens())
  //   return this.get(searchedToken)
  // }
  // public get<T extends keyof Assign4<ParentNodeContext, ThisNodeContext>>(
  //   t: T,
  // ) {
  //   return super.get(t)
  // }

  /**
   * We can actually extract this into a wrapper class
   */
  // public async getContainerSet<
  //   T extends keyof Assign4<ParentNodeContext, ThisNodeContext>,
  // >(tokens: T[]) {
  //   let promiseTokens: T[] = []
  //   let allPromises: any = []
  //   for (let token of tokens) {
  //     if (this.containers[token] instanceof Promise) {
  //       promiseTokens.push(token)
  //       allPromises.push(this.containers[token])
  //     }
  //   }

  //   let containerDecoratedMap: {
  //     [K in T]: AssignAndUnpack<ParentNodeContext, ThisNodeContext>[K]
  //   } = {} as any

  //   // Step 1: Assign all values
  //   tokens.forEach((token) => {
  //     containerDecoratedMap[token as any] = this.containers[token]
  //   })

  //   // Step 2: Overwrite Promise like values with promise results
  //   const rez = await Promise.all(allPromises)
  //   promiseTokens.forEach((token, index) => {
  //     containerDecoratedMap[token] = rez[index]
  //   })

  //   return containerDecoratedMap
  // }

  public get containers() {
    type ContainerGetter = {
      [CK in keyof Context]: Context[CK]
    }
    let containerMap = <ContainerGetter>{}
    for (let key in this.getTokens()) {
      addGetter(containerMap, key, () => this.get(key as any))
    }
    return containerMap
  }
}

export function makeRoot() {
  const lol = new NodeApi()
  return lol
}
