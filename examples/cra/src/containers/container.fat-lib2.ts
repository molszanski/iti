import type { FatLib2_3MB } from "../fat-libs/fat-lib2"
import type { GetContainerFormat } from "../_library/_utils"

let x: FatLib2_3MB
/**
 * Fat Lib 1 shows an example how we can use async modules from react
 */
export async function provideFatLib2() {
  console.log("~~~ provider for fat lib 2 initiated 0")
  return {
    getFatLib2Data: async function () {
      let { FatLib2_3MB } = await import("../fat-libs/fat-lib2")

      console.log("~~~ provider for fat lib 2 initiated 1")
      console.log(FatLib2_3MB)

      return new FatLib2_3MB()
    },
  }
}

// export interface FatLib2Container {
//   getFatLib2Data: () => Promise<FatLib2_3MB>
// }

export type FatLib2Container = GetContainerFormat<typeof provideFatLib2>
