import React, { useMemo, Suspense } from "react"
import { getItemSetHooks } from "iti-react"
import { createApp } from "./two/bl"

export const prerender = false

const Ctx = React.createContext<ReturnType<typeof createApp>>({} as any)
const hooks = getItemSetHooks(Ctx)
const useItemSet = hooks.useItemSet
const useItem = hooks.useItem

const ProcessedDataDisplay = () => {
  const [itemSet, err] = useItemSet((c) => [c.processedData])
  console.log("getting processedData", itemSet)

  if (itemSet == null) {
    console.log("ProcessedDataDisplay not ready", err)
    return <div>Loading processed data...</div>
  }

  const { processedData } = itemSet
  console.log("processedData", processedData)

  return (
    <div>
      <h3>Processed Data (Derived from Server Data)</h3>
      <h5>Message: {processedData.message}</h5>

      <details>
        <summary>Full Data</summary>
        <pre>{JSON.stringify(processedData, null, 2)}</pre>
      </details>
    </div>
  )
}

const App = () => {
  console.log(" ~~~> App Render")

  return (
    <div>
      <h1>Three - SSR Hydration Example</h1>
      <ProcessedDataDisplay />
    </div>
  )
}

export type ThreeProps = {
  hydrationData?: any
}

const StateWrapper = ({ hydrationData }: ThreeProps) => {
  console.log("~~~> StateWrapper Render")
  const x = useMemo(() => createApp(JSON.parse(hydrationData)), [hydrationData])
  console.log("~~~> StateWrapper Render2")
  return (
    <Ctx.Provider value={x}>
      <App />
    </Ctx.Provider>
  )
}
// We need this middle step because Astro rerenders the top component for some reason
export const Three = ({ hydrationData }: ThreeProps) => {
  console.log("~~~> Three Render")
  return <StateWrapper hydrationData={hydrationData} />
}
