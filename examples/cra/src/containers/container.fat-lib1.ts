/**
 * Fat Lib 1 shows an example how we can use async modules from react
 */
export async function provideFatLib1() {
  console.log("~~~ provider for fat lib initiated 0")
  let x = await import("../fat-libs/fat-lib1")
  console.log("~~~ provider for fat lib initiated 1")
  console.log(x)
  let s = x.fatLib300kb()

  return {
    pizzaPlace: 12,
    fatLibData: s,

    getFatLibData: async function () {
      let x = await import("../fat-libs/fat-lib1")
      console.log("~~~ provider for fat lib initiated 1")
      console.log(x)
      x.fatLib300kb()
    },
  }
}
