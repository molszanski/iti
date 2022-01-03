import { configure } from "mobx"
import React, { useMemo } from "react"
import { RootStoreContext2 } from "./containers/_container.hooks"
import { getMainPizzaAppContainer } from "./containers/_root.store"
import "./App.css"
import { Main } from "./Main"

// don't allow state modifications outside actions
configure({ enforceActions: "always" })

interface AppProps {}

function App({}: AppProps) {
  const store = useMemo(() => getMainPizzaAppContainer(), [])

  return (
    <div className="App">
      <RootStoreContext2.Provider value={store}>
        <Main />
      </RootStoreContext2.Provider>
    </div>
  )
}

export default App
