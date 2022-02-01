import mitt from "mitt"
import { addGetter, UnPromisify } from "./_utils"
type ValueOf<T> = T[keyof T]

/**
 * We keep events and cache here, so many instances could share it
 */
const allEvents = new Map()
const allCache = {}

type GenericProviderSignature = (...args: any) => {
  [s: string]: () => Promise<any>
}

type GetContainer<
  Registry extends { [k: string]: () => Promise<any> },
  K extends keyof Registry,
> = UnPromisify<ReturnType<Registry[K]>>

export class RootContainer<
  getProv extends GenericProviderSignature,
  R extends ReturnType<getProv>,
  TokenKeyMap = { [T in keyof R]: T },
> {
  public readonly providerMap: R
  public readonly tokens: Array<keyof R>

  constructor(getProviders: getProv) {
    this.providerMap = <R>{}

    let m = getProviders(this.providerMap, this)
    this.tokens = Object.keys(m)

    for (let contKey of this.tokens) {
      // @ts-expect-error
      this.providerMap[contKey] = () => {
        // @ts-expect-error
        return this.getGenericContainer(contKey, m[contKey])
      }
    }
  }

  public subscribeToContiner<T extends keyof R>(
    token: T,
    cb: (container: GetContainer<R, T>) => void,
  ): () => void {
    const containerUpdateSubscription = async (ev) => {
      if (token === ev.key) {
        let s = await this.containers[token]
        cb(s)
      }
    }
    this.on("containerCreated", containerUpdateSubscription)
    return () => this.off("containerCreated", containerUpdateSubscription)
  }

  public get containers() {
    type ContainerGetter = {
      [CK in keyof R]: Promise<GetContainer<R, CK>>
    }
    let containerMap = <ContainerGetter>{}
    for (let key of this.tokens) {
      addGetter(containerMap, key, () => this.providerMap[key]())
    }
    return containerMap
  }

  /**
   * We can actually extract this into a wrapper class
   */
  public async getContainerSet<T extends keyof R>(
    tokensOrCb: T[] | ((keyMap: TokenKeyMap) => T[]),
  ) {
    let tokens = this.getTokensOverload(tokensOrCb)
    let fWithProm = tokens.map((containerKey) => this.providerMap[containerKey])

    let allProm = fWithProm.map((el) => el())

    let containerDecoratedMap: {
      [K in T]: GetContainer<R, K>
    } = {} as any

    const x = await Promise.all(allProm)

    tokens.forEach((containerKey, index) => {
      containerDecoratedMap[containerKey] = x[index]
    })
    return containerDecoratedMap
  }

  public getContainerSetCallback<T extends keyof R>(
    cb: (keyMap: TokenKeyMap) => T[],
  ): T[] {
    let containerMap = <TokenKeyMap>{}
    for (let key of this.tokens) {
      // @ts-expect-error
      containerMap[key] = key
    }
    return cb(containerMap)
  }

  private getTokensOverload<T extends keyof R>(
    tokensOrCb: T[] | ((keyMap: TokenKeyMap) => T[]),
  ) {
    let tokens = tokensOrCb
    if (typeof tokensOrCb === "function") {
      tokens = this.getContainerSetCallback(tokensOrCb)
    } else {
      tokens = tokensOrCb
    }
    return tokens
  }

  /**
   * We can actually extract this into a wrapper class
   */
  public subscribeToContinerSet<T extends keyof R>(
    tokensOrCb: T[] | ((keyMap: TokenKeyMap) => T[]),
    cb: (containerSet: {
      [K in T]: GetContainer<R, K>
    }) => void,
  ): () => void {
    let tokens = this.getTokensOverload(tokensOrCb)
    const containerSetSubscription = async (ev) => {
      if (tokens.includes(ev.key)) {
        let s = await this.getContainerSet(tokens)
        cb(s)
      }
    }
    this.on("containerCreated", containerSetSubscription)
    return () => this.off("containerCreated", containerSetSubscription)
  }

  /**
   * EventEmitter Logic
   */
  private ee = mitt<{
    containerCreated: {
      key: keyof R
      newContainer: ValueOf<R>
    }
    containerRemoved: {
      key: keyof R
    }
    containerRequested: {
      key: keyof R
    }
  }>(allEvents)
  public on = this.ee.on
  public off = this.ee.off

  /**
   * Cache
   */
  private containerCache: Partial<R> = allCache

  public async getGenericContainer<T extends keyof R>(
    key: T,
    containerProvider: () => R[T],
  ): Promise<T> {
    this.ee.emit("containerRequested", {
      key: key,
    })
    if (this.containerCache[key] == null) {
      /**
       * This is a first run on app init
       * or it was replaced
       */
      const containerPromise = containerProvider()
      this.containerCache[key] = containerPromise as any

      await containerPromise
      this.ee.emit("containerCreated", {
        key: key,
        newContainer: containerPromise as any,
      })
    }

    if (this.containerCache[key] != null) {
      const containerPromise = this.containerCache[key]
      if (containerPromise != null) {
        await containerPromise
        return containerPromise as any
      }
    }

    throw new Error("Should not reach here")
  }

  /**
   * Clear first, then slowly recreate
   */
  public async replaceContainerInstantly<T extends keyof R>(
    key: T,
    containerProvider: R[T],
  ) {
    delete this.containerCache[key]
    this.ee.emit("containerRemoved", {
      key: key,
    })
    // for some reasone we do need it
    // @ts-expect-error
    return this.getGenericContainer(key, containerProvider)
  }
}

export function makeRoot<getProv extends GenericProviderSignature>(
  getProviders: getProv,
) {
  type R = ReturnType<getProv>
  let root = new RootContainer<typeof getProviders, R>(getProviders)
  return root
}

// Commented out because they seem to not be needed yet

// public hasContainer(key: keyof R): Boolean {
//   if (this.containerCache[key] == null) {
//     return false
//   }
//   return true
// }

/**
 * Kinda like stale while rewalidate
 */
//  public async replaceCointerAsync<T extends ValueOf<R>>(
//   key: keyof R,
//   containerProvider: () => T,
// ): Promise<T> {
//   const containerPromise = await containerProvider()
//   this.ee.emit("containerCreated", {
//     key: key,
//     newContainer: containerPromise,
//   })
//   this.containerCache[key] = containerPromise
//   return containerPromise
// }

// public async getContainer(
//   key: keyof R,
// ): Promise<ValueOf<R>> {
//   if (this.containerCache[key] == null) {
//     throw new Error("NO no tak się nie bawimy")
//   } else {
//     const containerPromise = this.containerCache[key]
//     await containerPromise
//     return containerPromise as any
//   }
// }

// Failed. Circular reference:

// export function getProviderWrapper<
//   getProviderFun extends (root: MockAppContainer) => any,
//   R extends ReturnType<getProviderFun>,
//   kiz extends keyof R,
//   Registry extends { [K in kiz]: () => UnPromisify<ReturnType<R[K]>> },
//   Lib extends (...args: any) => { [K in keyof Registry]: Registry[K] },
//   MockAppContainer extends RootContainer<Lib, ReturnType<Lib>>,
// >(cb: getProviderFun) {
//   const r = new RootContainer(cb)
//   // @ts-expect-error
//   cb(r)
//   return 1 as any as R
// }

// Failed: Circular reference
// // https://github.com/microsoft/TypeScript/issues/29586

// type GenericProviderSignature = (...args: any) => {
//   [s: string]: () => Promise<any>
// }
// type R<getProviderFun extends GenericProviderSignature> =
//   ReturnType<getProviderFun>

// type kiz<getProviderFun extends GenericProviderSignature> =
//   keyof R<getProviderFun>

// type Registry2M<getProviderFun extends GenericProviderSignature> = {
//   [K in kiz<getProviderFun>]: () => UnPromisify<ReturnType<R[K]>>
// }
// type Lib33<Registry23 extends Registry2M<typeof getProviders>> = (
//   ...args: any
// ) => { [K in keyof Registry23]: Registry23[K] }

// type ZisRegistry = Registry2M<typeof getProviders>
// type MockAppContainer33 = RootContainer<
//   Lib33<ZisRegistry>,
//   ReturnType<Lib33<ZisRegistry>>
// >
