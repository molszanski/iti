export class KitchenSizeUIController {
  constructor(
    private cbs: {
      onKitchenResize: () => Promise<any>
    },
  ) {}

  public async increaseKitchenSize() {
    this.cbs.onKitchenResize()
  }
}
