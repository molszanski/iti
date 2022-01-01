import { wait } from "../_library/_utils"
import { DayType, getDayType } from "../services/url-param"

export interface B_Container {
  dayType: DayType
}

export async function provideConfigContainer(): Promise<B_Container> {
  const b1 = getDayType()
  await wait(200)

  return {
    dayType: b1,
  }
}
