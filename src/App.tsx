import React, { useState, useEffect, useMemo } from "react"
import { RootStoreContext, useAContainer } from "./stores/_container.hooks"
import { AppContainer } from "./stores/_root.store"
import "./App.css"
import { Main } from "./Main"

interface AppProps {}

function App({}: AppProps) {
  const store = useMemo(() => new AppContainer(), [])
  return (
    <div className="App">
      <RootStoreContext.Provider value={store}>
        <Main />
      </RootStoreContext.Provider>
    </div>
  )
}

export default App
