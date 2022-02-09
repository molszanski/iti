import { DayType, getDayType } from "../services/url-param"
import { wait } from "./_utils"

export interface B_Container {
  dayType: DayType
}

export async function provideConfigContainer(): Promise<B_Container> {
  const b1 = getDayType()
  await wait(90)

  return {
    dayType: b1,
  }
}
