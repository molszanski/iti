import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import { MyAppContext, useContainer } from "./hooks"
import { app } from "./_bl"

const Lol = () => {
  // console.log(app)
  // const a = app.get("a")
  // console.log(a)
  // const [b, bErr] = useContainer().b
  // console.log("v", b, bErr)
  return <p>123</p>
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <MyAppContext.Provider value={app}>
      <div className="App">
        <Lol />
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </MyAppContext.Provider>
  )
}

export default App
