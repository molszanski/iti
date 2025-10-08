import { useState } from "react"
import { MyAppContext, useItem, useItemSet } from "./hooks"
import { app } from "./_bl"

const Lol = () => {
  const [itemSet, err] = useItemSet((c) => [c.x, c.y, c.a, c.b, c.c])
  if (itemSet == null) {
    console.log("not ready LOL1 ", err)
    return null
  }
  console.log("Render", itemSet.x, itemSet.a, itemSet.b, itemSet.c)

  return <p>123</p>
}

const Lol2 = () => {
  const [itemSet, err] = useItemSet((c) => [c.c])
  if (itemSet == null) {
    console.log("not ready LOL2 ", err)
    return null
  }
  console.log("Rendering Lol2 ", itemSet.c)

  return <p>123</p>
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <MyAppContext.Provider value={app}>
      <Lol />
      <Lol2 />
    </MyAppContext.Provider>
  )
}

export default App
