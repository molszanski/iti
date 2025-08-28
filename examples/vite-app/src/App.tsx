import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import { MyAppContext, useContainer, useContainerSet } from "./hooks"
import { app } from "./_bl"

const Lol = () => {
  const [itemSet, err] = useContainerSet((c) => [c.x, c.y])
  console.log("Render", itemSet)

  return <p>123</p>
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <MyAppContext.Provider value={app}>
      <div className="App">
        <Lol />
      </div>
    </MyAppContext.Provider>
  )
}

export default App
