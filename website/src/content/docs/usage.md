---
title: Usage
description: How to use ITI in your projects
slug: usage
position: 4
---

:::note

Please know, that the docs is still work in progress. Many features or use cases are probably already in the lib but not documented well. We are working on it.

:::

# Short Manual

## Reading and Writing data

**Reading**

```ts
// Get a single instance (async)
await root.get("oven") // Creates a new Oven instance
await root.get("oven") // Gets a cached Oven instance

// Get a single instance (sync) - ✨ New in v0.8.0
root.getSync("oven") // Returns cached instance or undefined

await node.get("kitchen") // Kitchen instance
await node.items.kitchen // same as above

// Plain deletion
node.delete("kitchen")

// Get multiple instances at once (async)
await root.getItems(["oven", "userManual"]) // { userManual: '...', oven: Oven }
await root.getItems((c) => [c.userManual, c.oven]) // same as above

// Get multiple instances at once (sync) - ✨ New in v0.8.0
root.getItemsSync(["oven", "userManual"]) // Returns items if cached, otherwise Promise

// Subscribe to item changes (new API)
node.subscribeToItem("oven", (oven) => {})
node.subscribeToItems(["oven", "kitchen"], ({ oven, kitchen }) => {})
// prettier-ignore
node.subscribeToItems((c) => [c.kitchen], ({ oven, kitchen }) => {})

// Item-focused events (recommended) - ✨ New in v0.8.0
node.on("itemUpdated", ({ key, newItem }) => {})
node.on("itemUpserted", ({ key, newItem }) => {})
node.on("itemDeleted", ({ key, newItem }) => {})
node.on("itemDisposed", ({ key }) => {})

// Legacy container events (still supported but deprecated)
node.on("containerUpdated", ({ key, newItem }) => {})
node.on("containerUpserted", ({ key, newItem }) => {})
node.on("containerDeleted", ({ key, newItem }) => {})

// Disposing
node
  .add({ dbConnection: () => connectToDb(process.env.dbUrl) })
  .addDisposer({ dbConnection: (db) => db.disconnect() }) // waits for promise
await node.dispose("dbConnection")
await node.disposeAll()
```

**Writing**

```ts
let cont1 = createContainer()
  .add({
    userManual: "Please preheat before use",
    oven: () => new Oven(),
  })
  .upsert((containers, node) => ({
    userManual: "Works better when hot",
    preheatedOven: async () => {
      await containers.oven.preheat()
      return containers.oven
    },
  }))

// `add` is typesafe and a runtime safe method. Hence we've used `upsert`
try {
  cont1.add({
    // @ts-expect-error
    userManual: "You shall not pass",
    // Type Error: (property) userManual: "You are overwriting this token. It is not safe. Use an unsafe `upsert` method"
  })
} catch (err) {
  err.message // Error Tokens already exist: ['userManual']
}
```
