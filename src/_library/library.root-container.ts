import mitt from "mitt"
import _ from "lodash"
import { UnPromisify } from "./_utils"
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
> {
  public providerMap: R

  constructor(getProviders: getProv) {
    // @ts-expect-error
    this.providerMap = {}
    _.forOwn(getProviders(this.providerMap, this), (v: any, k: any) => {
      // @ts-expect-error
      this.providerMap[k] = () => {
        return this.getGenericContainer(k, v)
      }
    })
  }

  public get containers() {
    type ContainerGetter = {
      [CK in keyof R]: Promise<GetContainer<R, CK>>
    }

    let containerMap = <ContainerGetter>{}
    for (let key in this.providerMap) {
      containerMap[key] = this.providerMap[key]()
    }
    return containerMap
  }

  public subscribeToContiner<T extends keyof R>(
    token: T,
    cb: (container: GetContainer<R, T>) => void,
  ): void {
    this.on("containerUpdated", async (ev) => {
      if (token === ev.key) {
        let s = await this.containers[token]
        cb(s)
      }
    })
  }

  /**
   * We can actually extract this into a wrapper class
   */
  public async getContainerSet<T extends keyof R>(b: T[]) {
    let fWithProm = b.map((containerKey) => this.providerMap[containerKey])

    let allProm = fWithProm.map((el) => el())

    let containerDecoratedMap: {
      [K in T]: GetContainer<R, K>
    } = {} as any

    const x = await Promise.all(allProm)

    b.forEach((containerKey, index) => {
      containerDecoratedMap[containerKey] = x[index]
    })
    return containerDecoratedMap
  }

  public async getContainerSetNew<
    T extends keyof R,
    ContainerKeyMap extends {
      [CK in T]: CK
    },
    ConttainerGetter extends {
      [K in T]: GetContainer<R, K>
    },
  >(cb: (keyMap: ContainerKeyMap) => T[]) {
    let containerMap = <ContainerKeyMap>{}

    for (let key in this.providerMap) {
      // @ts-expect-error
      containerMap[key] = key
    }
    let xb = cb(containerMap)

    let fWithProm = xb.map((containerKey) => this.providerMap[containerKey])
    let allProm = fWithProm.map((el) => el())
    const x = await Promise.all(allProm)

    let containerDecoratedMap = <ConttainerGetter>{}
    xb.forEach((containerKey, index) => {
      containerDecoratedMap[containerKey] = x[index]
    })
    return containerDecoratedMap
  }

  /**
   * We can actually extract this into a wrapper class
   */
  public subscribeToContinerSet<T extends keyof R>(
    tokens: T[],
    cb: (containerSet: {
      [K in T]: GetContainer<R, K>
    }) => void,
  ): void {
    this.on("containerUpdated", async (ev) => {
      // @ts-expect-error
      if (tokens.includes(ev.key)) {
        let s = await this.getContainerSet(tokens)
        cb(s)
      }
    })
  }

  /**
   * EventEmitter Logic
   */
  private ee = mitt<{
    containerUpdated: {
      key: keyof R
      newContainer: ValueOf<R>
    }
  }>(allEvents)
  public on = this.ee.on

  /**
   * Cache
   */
  private containerCache: Partial<R> = allCache

  public async getGenericContainer<T extends keyof R>(
    key: T,
    containerProvider: () => R[T],
  ): Promise<T> {
    if (this.containerCache[key] == null) {
      const containerPromise = containerProvider()
      this.containerCache[key] = containerPromise as any

      await containerPromise
      this.ee.emit("containerUpdated", {
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
  public async replaceCointerInstantly<T extends keyof R>(
    key: T,
    containerProvider: R[T],
  ) {
    delete this.containerCache[key]
    // for some reasone we do
    // @ts-expect-error
    return this.getGenericContainer(key, containerProvider)
  }

  /**
   * Kinda like stale while rewalidate
   */
  public async replaceCointerAsync<T extends ValueOf<R>>(
    key: keyof R,
    containerProvider: () => T,
  ): Promise<T> {
    const containerPromise = await containerProvider()
    this.ee.emit("containerUpdated", {
      key: key,
      newContainer: containerPromise,
    })
    this.containerCache[key] = containerPromise
    return containerPromise
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
