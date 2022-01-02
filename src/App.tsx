import { configure } from "mobx"
import React, { useMemo } from "react"
import {
  RootStoreContext,
  RootStoreContext2,
} from "./containers/_container.hooks"
import { AppContainer, lol } from "./containers/_root.store"
import "./App.css"
import { Main } from "./Main"

// don't allow state modifications outside actions
configure({ enforceActions: "always" })

interface AppProps {}

function App({}: AppProps) {
  const store = useMemo(() => new AppContainer(), [])
  const store2 = useMemo(() => lol(), [])

  return (
    <div className="App">
      <RootStoreContext.Provider value={store}>
        <RootStoreContext2.Provider value={store2}>
          <Main />
        </RootStoreContext2.Provider>
      </RootStoreContext.Provider>
    </div>
  )
}

export default App
