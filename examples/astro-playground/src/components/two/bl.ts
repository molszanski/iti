import { createContainer } from "iti"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export async function lolData() {
  await wait(2000)
  return "lolData"
}

async function fetchServerData() {
  await wait(1000)
  return {
    userId: 123,
    userName: "John Doe",
    timestamp: new Date().toISOString(),
  }
}

export type ServerData = Awaited<ReturnType<typeof fetchServerData>>

export type HydrationData = {
  serverData?: ServerData
}

export function createApp(hydrationData?: any) {
  console.log("~~~> calling createApp")
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
        await wait(200)
        return "four"
      },
    }))
    .add((ctx) => ({
      five: async () => {
        return (await ctx.four) + "Five"
      },
    }))
    .add({
      serverData: async () => {
        await wait(200)
        console.log("~~> fetching server data")
        return fetchServerData()
      },
    })
    .add((ctx) => ({
      processedData: async () => {
        const data = await ctx.serverData
        return {
          ...data,
          processed: true,
          message: `Hello ${data.userName}! Your ID is ${data.userId}`,
          processedAt: new Date().toISOString(),
        }
      },
    }))

  if (hydrationData) {
    console.log("hydrating APP with: ", Object.keys(hydrationData))
    for (const key in hydrationData) {
      // @ts-ignore
      container._storeInCache(key, hydrationData[key])
      // @ts-ignore
      container._storeInSyncCache(key, hydrationData[key])
    }
  }

  return container
}
