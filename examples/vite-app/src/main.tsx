import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { app } from "./_bl"

async function main() {
  console.log("preloading D, kinda like SSR mode")
  await app.items.d

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

main().then(() => {
  console.log("main done")
})
