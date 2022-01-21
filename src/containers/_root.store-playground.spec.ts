import _ from "lodash"
import { wait } from "../_library/_utils"
import { getMainPizzaAppContainer } from "./_root.store"

it.only("lol", (cb) => {
  ;(async () => {
    let a = 12
    expect(a).toBe(12)
    cb()
  })()
})
