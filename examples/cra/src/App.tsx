import { configure } from "mobx"
import React, { useMemo } from "react"
import { RootStoreContext } from "./containers/_container.hooks"
import { getMainPizzaAppContainer } from "./containers/_root.store"
import { Main } from "./Main"
import "./App.css"

// don't allow state modifications outside actions
configure({ enforceActions: "always" })

interface AppProps {}

function App({}: AppProps) {
  const store = useMemo(() => getMainPizzaAppContainer(), [])

  return (
    <div className="App">
      <RootStoreContext.Provider value={store}>
        <Main />
      </RootStoreContext.Provider>
    </div>
  )
}

export default App
