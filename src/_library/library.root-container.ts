import mitt from "mitt"
import _ from "lodash"
import { UnPromisify } from "./_utils"
type ValueOf<T> = T[keyof T]

/**
 * We keep events and cache here, so many instances could share it
 */
const allEvents = new Map()
const allCache = {}

export class RootContainerInner<
  getProv extends (...args: any) => any,
  R = ReturnType<getProv>,
> {
  public providerMap: R
  // @ts-ignore
  public haha: R

  constructor(getProviders: getProv) {
    // @ts-ignore
    this.providerMap = {}
    // @ts-ignore
    _.forOwn(getProviders(this.providerMap, this), (v: any, k: any) => {
      //@ts-ignore
      this.providerMap[k] = () => {
        return this.getGenericContainer(k, v)
      }
    })
  }

  /**
   * We can actually extract this into a wrapper class
   */
  public subscribeToContinerSet<T extends keyof R>(
    tokens: T[],
    cb: (
      containerSet: Awaited<{
        // @ts-ignore
        [K in T]: UnPromisify<ReturnType<R[K]>>
      }>,
    ) => void,
  ): void {
    this.on("containerUpdated", async (ev) => {
      // @ts-ignore
      if (tokens.includes(ev.key)) {
        let s = await this.getContainerSet(tokens)
        // @ts-ignore
        cb(s)
      }
    })
  }

  /**
   * We can actually extract this into a wrapper class
   */
  public async getContainerSet<T extends keyof R>(b: T[]) {
    let fWithProm = b.map((containerKey) => this.providerMap[containerKey])

    // @ts-expect-error
    let allProm = fWithProm.map((el) => el())

    let containerDecoratedMap: {
      // @ts-ignore
      [K in T]: UnPromisify<ReturnType<R[K]>>
    } = {} as any

    const x = await Promise.all(allProm)

    b.forEach((containerKey, index) => {
      containerDecoratedMap[containerKey] = x[index]
    })
    return containerDecoratedMap
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
    //@ts-ignore
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
}

export class RootContainer<
  T extends (...args: any) => any,
> extends RootContainerInner<T> {}
