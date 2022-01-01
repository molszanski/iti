import { configure } from "mobx"
import React, { useMemo } from "react"
import { RootStoreContext } from "./containers/_container.hooks"
import { AppContainer } from "./containers/_root.store"
import "./App.css"
import { Main } from "./Main"

// don't allow state modifications outside actions
configure({ enforceActions: "always" })

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

// import { configure } from "mobx"
// import React, { useMemo } from "react"
// import {
//   RootStoreContext,
//   SecondAppContext,
// } from "./containers/_container.hooks"
// import { AppContainer, SecondAppContainer } from "./containers/_root.store"
// import "./App.css"
// import { Main } from "./Main"

// // don't allow state modifications outside actions
// configure({ enforceActions: "always" })

// interface AppProps {}

// function App({}: AppProps) {
//   const store = useMemo(() => new AppContainer(), [])
//   const store2 = useMemo(() => new SecondAppContainer(), [])
//   return (
//     <div className="App">
//       <RootStoreContext.Provider value={store}>
//         <SecondAppContext.Provider value={store2}>
//           <Main />
//         </SecondAppContext.Provider>
//       </RootStoreContext.Provider>
//     </div>
//   )
// }

// export default App
