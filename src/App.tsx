import React, { useState, useEffect } from "react"
import { RootStoreContext, useAContainer } from "./stores/_container.hooks"
import { RootContainer } from "./stores/_root.store"
import "./App.css"
import { Main } from "./Main"

interface AppProps {}

function App({}: AppProps) {
  const [store, setStore] = useState<any>(null)
  useEffect(() => {
    const root = new RootContainer()
    setStore(root)
  }, [])
  if (!store) return null

  return (
    <div className="App">
      <RootStoreContext.Provider value={store}>
        <Main />
      </RootStoreContext.Provider>
    </div>
  )
}

export default App
