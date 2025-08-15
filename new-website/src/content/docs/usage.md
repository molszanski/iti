---
title: Usage
description: How to use ITI in your projects
---

:::note

Please know, that the docs is still work in progress. Many features or use cases are probably already in the lib but not documented well. We are working on it.

:::

# Short Manual

## Reading and Writing data

**Reading**

```ts
// Get a single instance
root.get("oven") // Creates a new Oven instance
root.get("oven") // Gets a cached Oven instance

await node.get("kitchen") // { kitchen: Kitchen } also cached
await node.items.kitchen // same as above

// Plain deletion
node.delete("kitchen")

// Get multiple instances at once
await root.getContainerSet(["oven", "userManual"]) // { userManual: '...', oven: Oven }
await root.getContainerSet((c) => [c.userManual, c.oven]) // same as above

// Subscribe to container changes
node.subscribeToContainer("oven", (oven) => {})
node.subscribeToContainerSet(["oven", "kitchen"], ({ oven, kitchen }) => {})
// prettier-ignore
node.subscribeToContainerSet((c) => [c.kitchen], ({ oven, kitchen }) => {})
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
let node1 = createContainer()
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
  node1.add({
    // @ts-expect-error
    userManual: "You shall not pass",
    // Type Error: (property) userManual: "You are overwriting this token. It is not safe. Use an unsafe `upsert` method"
  })
} catch (err) {
  err.message // Error Tokens already exist: ['userManual']
}
```
