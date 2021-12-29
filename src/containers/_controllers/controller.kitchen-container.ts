export class KitchenSizeController {
  constructor(
    private cbs: {
      onKitchenResize: () => void
    },
  ) {}

  public async increaseKitchenSize() {
    console.log("some magic must increase kitchen size")
    this.cbs.onKitchenResize()
  }
}
