import { configure } from "mobx"
import React, { useMemo } from "react"
import { RootStoreContext2 } from "./containers/_container.hooks"
import { lol } from "./containers/_root.store"
import "./App.css"
import { Main } from "./Main"

// don't allow state modifications outside actions
configure({ enforceActions: "always" })

interface AppProps {}

function App({}: AppProps) {
  const store2 = useMemo(() => lol(), [])

  return (
    <div className="App">
      <RootStoreContext2.Provider value={store2}>
        <Main />
      </RootStoreContext2.Provider>
    </div>
  )
}

export default App
