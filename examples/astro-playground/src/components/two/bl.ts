import { createContainer } from "iti"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export async function lolData() {
  await wait(2000)
  return "lolData"
}

export function createApp() {
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
    .add((ctx) => ({
      four: async () => {
        await wait(500)
        return "four"
      },
    }))
    .add((ctx) => ({
      five: async () => {
        return (await ctx.four) + "Five"
      },
    }))
  return container
}
