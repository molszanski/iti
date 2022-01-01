export class KitchenSizeUIController {
  constructor(
    private cbs?: {
      onKitchenResize: () => Promise<any>
    },
  ) {}

  public async increaseKitchenSize() {
    console.log("kitchen resize")
    // this.cbs.onKitchenResize()
  }
}
