import React, { useMemo, use, Suspense, useContext } from "react"
import { getItemSetHooks } from "iti-react"
import { createApp, lolData } from "./two/bl"

const Ctx = React.createContext<ReturnType<typeof createApp>>({} as any)
const hooks = getItemSetHooks(Ctx)
const useItemSet = hooks.useItemSet
const useItem = hooks.useItem

const Looool1 = () => {
  // console.log("stuff22")
  // const stuff = use(lolData())
  const container = useContext(Ctx)
  const stuff = use(container.items.four)
  console.log("container lol1", container)
  console.log("stuff lol1", stuff)
  return (
    <div>
      Loool 1
      <Looool2 />
    </div>
  )
}

const x = lolData()
const Looool2 = () => {
  const stuff = use(x)
  console.log("stuff2", stuff)
  return <span>Looool2 {stuff}</span>
}

const App = () => {
  // const [itemSet, err] = useItemSet((c) => [c.four, c.five])
  // if (itemSet == null) {
  //   console.log("not ready LOL1 ", err)
  //   return null
  // }
  // console.log("Render", itemSet.four, itemSet.five)
  console.log("App")

  return (
    <div>
      <h1>Two</h1>
      <div>
        <Looool1 />
      </div>
    </div>
  )
}

export const Three = () => {
  const x = useMemo(() => createApp(), [])
  return (
    <Ctx.Provider value={x}>
      <Suspense>
        <App />
      </Suspense>
    </Ctx.Provider>
  )
}
