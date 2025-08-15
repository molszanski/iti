---
title: Patterns and Tips
description: Useful patterns and tips for using ITI effectively
---

:::note

Please know, that the docs is still work in progress. Many features or use cases are probably already in the lib but not documented well. We are working on it.

:::

# Patterns and Tips

## Patterns and tips

### Make lazy simple

Prefer functions over eager init. Why? This will make the app lazy, hence faster.

```ts
// Good
createContainer().add({
  eventBus: () => new EventBus(),
  userAuthService: () => new UserAuthService(),
})

// Meh...
createContainer().add({
  eventBus: new EventBus(),
  userAuthService: new UserAuthService(),
})
```

In the second example we create instances on IoC container start. Which in most cases is not desirable. With the first example, we use functions, and they will be executed only when requested

### Lifecycle

**Single Instance (a.k.a. Singleton)**

```ts
let node = createContainer().add({
  oven: () => new Oven(),
})
node.get("oven") === node.get("oven") // true
```

**Transient**

```ts
let node = createContainer().add({
  oven: () => () => new Oven(),
})
node.get("oven") === node.get("oven") // false
```

### Dynamic Imports

```ts
// ./kitchen/index.ts
export async function provideKitchenContainer() {
  const { Kitchen } = await import("./kitchen/kitchen")
  return {
    kitchen: () => new Kitchen(),
    oven: async () => {
      const { Oven } = await import("./kitchen/oven")
      const oven = new Oven()
      await oven.preheat()
      return oven
    },
  }
}
```

```ts
// ./index.ts
import { createContainer } from "iti"
import { provideKitchenContainer } from "./kitchen"
let node = createContainer().add({
  kitchen: async () => provideKitchenContainer(),
})

// Next line will load `./kitchen/kitchen` module
await node.items.kitchen

// Next line will load `./kitchen/oven` module
await node.items.kitchen.oven
```

### Tip: Prefer callbacks over of strings (in progress)

If you use callback pattern across your app, you will be able to mass rename your containerKeys using typescript. With strings, you will have to manually go through the app. But even if you use string literals compiler will not compile until you fix your rename manually across the app.

```ts
const node = createContainer().addNode({
  a: "A",
  b: "B",
})

await node.get((containerKeys) => containerKeys.a) // BEST!!!
await node.get("a") // it will work but...
```

## Anti Patterns

in progress

## Known issues

### TS2589: Type instantiation is excessively deep and possibly infinite

This bug is caused by a TS hard limit on 50 `instantiationDepth`.

https://github.com/i18next/react-i18next/issues/1417
https://github.com/microsoft/TypeScript/issues/34933

As a quick workaround we suggest:

1. **Reduce the number of `.add` steps** - this will help in most cases
2. **Reduce the number of unique tokens** - group some tokens together
3. **Create multiple containers** - it seems that your app is getting pretty big and complex. Maybe create to 2 containers via `createContainer`?
4. **Upgrade to TS 4.5 or higher**
5. **Optimize ITI**
