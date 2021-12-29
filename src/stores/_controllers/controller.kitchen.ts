export class KitchenSizeUIController {
  constructor(
    private cbs: {
      onKitchenResize: () => Promise<any>
    },
  ) {}

  public async increaseKitchenSize() {
    console.log("some magic must increase kitchen size")
    this.cbs.onKitchenResize()
  }
}
