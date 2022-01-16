export async function provideFatLib1() {
  console.log("~~~ provider for fat lib initiated 0")

  return {
    pizzaPlace: 12,

    getFatLibData: async function () {
      let x = await import("../fat-libs/fat-lib1")
      console.log("~~~ provider for fat lib initiated 1")
      console.log(x)
      x.fatLib300kb()
    },
  }
}
