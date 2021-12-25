//
type ValueOf<T> = T[keyof T]

export class RootContainer<GenericContainerRegistry> {
  private containerCache: Partial<GenericContainerRegistry> = {}

  public async getGenericContainer<T extends ValueOf<GenericContainerRegistry>>(
    key: keyof GenericContainerRegistry,
    containerProvider: () => T,
  ): Promise<T> {
    if (this.containerCache[key] == null) {
      console.log("requesting new container")
      const containerPromise = containerProvider()
      this.containerCache[key] = containerPromise as any
    }

    if (this.containerCache[key] != null) {
      console.log("getting from cache container")
      const containerPromise = this.containerCache[key]
      if (containerPromise != null) {
        await containerPromise
        return containerPromise as any
      }
    }

    throw new Error("WTF")
  }

  public hasContainer(key: keyof GenericContainerRegistry): Boolean {
    if (this.containerCache[key] == null) {
      return false
    }
    return true
  }
}
