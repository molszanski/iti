import mitt from "mitt"

type ValueOf<T> = T[keyof T]

const allEvents = new Map()
const allCache = {}

export class RootContainer<GenericContainerRegistry> {
  constructor() {}
  private ee = mitt<{
    containerUpdated: {
      key: keyof GenericContainerRegistry
      // oldContainer: ValueOf<GenericContainerRegistry>
      newContainer: ValueOf<GenericContainerRegistry>
    }
  }>(allEvents)

  public on = this.ee.on

  private containerCache: Partial<GenericContainerRegistry> = allCache

  public async getGenericContainer<T extends ValueOf<GenericContainerRegistry>>(
    key: keyof GenericContainerRegistry,
    containerProvider: () => T,
  ): Promise<T> {
    if (this.containerCache[key] == null) {
      console.log(`requesting new container [${key}]`)
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

    throw new Error("WTF")
  }

  /**
   * Clear first, then slowly recreate
   */
  public async replaceCointerInstantly<
    T extends ValueOf<GenericContainerRegistry>,
  >(
    key: keyof GenericContainerRegistry,
    containerProvider: () => T,
  ): Promise<T> {
    delete this.containerCache[key]
    return this.getGenericContainer(key, containerProvider)
  }

  /**
   * Kinda like stale while rewalidate
   */
  public async replaceCointerAsync<T extends ValueOf<GenericContainerRegistry>>(
    key: keyof GenericContainerRegistry,
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

  // public hasContainer(key: keyof GenericContainerRegistry): Boolean {
  //   if (this.containerCache[key] == null) {
  //     return false
  //   }
  //   return true
  // }

  // public async getContainer(
  //   key: keyof GenericContainerRegistry,
  // ): Promise<ValueOf<GenericContainerRegistry>> {
  //   if (this.containerCache[key] == null) {
  //     throw new Error("NO no tak się nie bawimy")
  //   } else {
  //     const containerPromise = this.containerCache[key]
  //     await containerPromise
  //     return containerPromise as any
  //   }
  // }
}
