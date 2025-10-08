import React, { useMemo, useEffect, useState } from "react"
import { createContainer } from "iti"
import { getItemSetHooks } from "iti-react"

const container = createContainer()
  .add({
    name: async () => "One",
  })
  .add((ctx) => ({
    two: async () => (await ctx.name) + "Two",
  }))
  .add((ctx) => ({
    three: async () => {
      throw new Error("three")
    },
  }))

const Ctx = React.createContext(container)
const hooks = getItemSetHooks(Ctx)
const useItemSet = hooks.useItemSet
const useItem = hooks.useItem

async function main() {
  try {
    console.log("~~~~1")
    await container.items.three
    console.log("~~~~2")
  } catch (e) {
    console.log("Other error~~~>", e)
  }
}

const ErrorOne = () => {
  const [x, err] = useItemSet((c) => [c.name, c.two, c.three])
  console.log("~~~>", x, err)

  return <div>Error</div>
}

export const One = () => {
  useEffect(() => {
    main()
  }, [])
  const x = useMemo(() => container, [])
  return (
    <Ctx.Provider value={x}>
      <ErrorOne />
    </Ctx.Provider>
  )
}
