import React, { useMemo } from "react"
import { configure } from "mobx"
import { MyRootCont } from "./containers/_container.hooks"
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
      <MyRootCont.Provider value={store}>
        <Main />
      </MyRootCont.Provider>
    </div>
  )
}

export default App
