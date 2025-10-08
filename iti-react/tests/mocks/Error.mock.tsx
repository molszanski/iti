import React, { createElement, useMemo, ReactNode } from "react"
import { createContainer } from "iti"
import { getContainerHooks } from "../../src/index"

// ----------

function getContainer() {
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
  return container
}
const container = getContainer()

const LOL = React.createContext(container)
const hooks = getContainerHooks(LOL)
export const useItems = hooks.useItems
export const useItem = hooks.useItem

async function main() {
  try {
    console.log("~~~~1")
    await container.items.three
    console.log("~~~~2")
  } catch (e) {
    console.log("Other error~~~>", e)
  }
}

export function ErrorAppWrapper({ children }: { children?: ReactNode }) {
  const store = useMemo(() => container, [])
  return <LOL.Provider value={store}>{children}</LOL.Provider>
}
