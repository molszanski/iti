<p align="center">
  <a href="https://itijs.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="./docs/logo.svg" alt="ITI Logo">
  </a>
</p>

<div align="center">

# Iti

<h4>~1kB Dependency Injection Library for Typescript and React with a unique <strong>async flow</strong> support</h4>

<p align="center">
  <a href="https://github.com/molszanski/iti/actions?query=branch%3Amaster"><img src="https://github.com/molszanski/iti/actions/workflows/lib-test.yml/badge.svg" alt="CI Status"></a>
  <a href="https://www.npmjs.org/package/iti"><img src="https://img.shields.io/npm/v/iti.svg" alt="npm version"></a>
  <a href="https://unpkg.com/iti/dist/iti.modern.js"><img src="https://img.badgesize.io/https://unpkg.com/iti/dist/iti.modern.js?compression=gzip" alt="gzip"></a>
  <!-- Manually checked at b1683832 on OCT 8 2022-->
  <a href="https://dashboard.stryker-mutator.io/reports/github.com/molszanski/iti/master"><img src="https://img.shields.io/badge/coverage-98.6%25-brightgreen" alt="Coverage"></a>
  <a href="https://dashboard.stryker-mutator.io/reports/github.com/molszanski/iti/master"><img src="https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fmolszanski%2Fiti%2Fmaster" alt="Mutation Score"></a>
</p>

</div>

- **supports async(!):** merges async code and constructor injection via plain **async** functions
- **non-invasive:** does not require imported `@decorators` or framework `extends` in your application business logic
- **strongly typed:** has great IDE autocomplete and compile time check. Without any [manual type casting](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#containergettserviceidentifier-interfacesserviceidentifiert-t)
- **lazy:** initializes your app modules and containers on demand
- **split chunks:** enables **[dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)** via a [one liner](#dynamic-imports) thanks to a fully async core
- **React friendly:** has useful **[React](https://github.com/molszanski/iti/tree/master/iti-react)** bindings to help you separate application business logic and a React view layer
- **starter friendly:** works with starters like [Create React App](https://create-React-app.dev/) or [Next.js](https://nextjs.org/docs/getting-started) unlike existing libraries
- **no Babel config:** doesn't require `reflect-metadata` or decorators so there is no need to hack in decorator and `"decoratorMetadata"` support in to your build configs
- **tiny:** less than 1kB

IoC is an amazing pattern and it should **easy to adopt**, fully support async and without hard to learn APIs or complex tooling requirements.

Iti relies on plain JS functions, objects and familiar patterns. API is simple so you can make a **proof of concept integration in minutes**.

It is an alternative to [InversifyJS](https://github.com/inversify/InversifyJS) and [microsoft/tsyringe](https://github.com/microsoft/tsyringe) for constructor injection.

> _At [Packhelp](https://unpacked.packhelp.com) we’ve refactored most of our 65K SLOC Editor app, that didn't have any IoC, to Iti in under 5 hours_

## Usage

```ts
// kitchen.ts
export class Oven {
  public pizzasInOven() {
    return 7
  }
  public async preheat() {}
}
export class Kitchen {
  constructor(public oven: Oven, public userManual: string) {}
}
// Application code is free of framework dependencies of decorators
```

```tsx
// app.ts
import { createContainer } from "iti"
import { Oven, Kitchen } from "./kitchen"

const container = createContainer()
  .add({
    key: () => new Item(),
    oven: () => new Oven(),
    userManual: async () => "Please preheat before use",
  })
  .add((items) => ({
    kitchen: async () => new Kitchen(items.oven, await items.userManual),
  }))

await container.get("kitchen") // Kitchen
```

```tsx
// MyPizzaComponent.tsx
export const PizzaData = () => {
  const kitchen = useContainer().kitchen
  return <>Pizzas In Oven: {kitchen.oven.pizzasInOven()}</>
}
```

## Why another library?

The main reason is that existing libraries don’t support **asynchronous code**. Iti brings hassle free and fully typed way to use async code.

Secondly, existing libraries rely on decorators and `reflect-metadata`[^1]. They **couple your application business logic with a single framework** and they tend to become unnecessarily complex. Also existing implementations will likely be incompatible with a [TC39 proposal](https://github.com/tc39/proposal-decorators).

Also it is hard to use `reflect-metadata` with starters like CRA, Next.js etc. You need to `eject` or hack starters and it is far from ideal.

## Short Manual

**Reading**

```ts
// Get a single instance
container.get("oven") // Creates a new Oven instance
container.get("oven") // Gets a cached Oven instance

await container.get("kitchen") // { kitchen: Kitchen } also cached
await container.items.kitchen // same as above

// Get multiple instances at once
await container.getContainerSet(["oven", "userManual"]) // { userManual: '...', oven: Oven }
await container.getContainerSet((c) => [c.userManual, c.oven]) // same as above

// Plain deletion
container.delete("kitchen")

// Subscribe to container changes
container.subscribeToContainer("oven", (oven) => {})
container.subscribeToContainerSet(
  ["oven", "kitchen"],
  ({ oven, kitchen }) => {},
)
// prettier-ignore
container.subscribeToContainerSet((c) => [c.kitchen], ({ oven, kitchen }) => {})
container.on("containerUpdated", ({ key, newItem }) => {})
container.on("containerUpserted", ({ key, newItem }) => {})
container.on("containerDeleted", ({ key, newItem }) => {})

// Disposing
container
  .add({ dbConnection: () => connectToDb(process.env.dbUrl) })
  .addDisposer({ dbConnection: (db) => db.disconnect() }) // waits for promise
await container.dispose("dbConnection")
await container.disposeAll()
```

**Writing**

```ts
let container = createContainer()
  .add({
    userManual: "Please preheat before use",
    oven: () => new Oven(),
  })
  .upsert((items, cont) => ({
    userManual: "Works better when hot",
    preheatedOven: async () => {
      await items.oven.preheat()
      return items.oven
    },
  }))

// `add` is typesafe and a runtime safe method. Hence we've used `upsert`
try {
  container.add({
    // @ts-expect-error
    userManual: "You shall not pass",
    // Type Error: (property) userManual: "You are overwriting this token. It is not safe. Use an unsafe `upsert` method"
  })
} catch (err) {
  err.message // Error Tokens already exist: ['userManual']
}
```

## Patterns and tips

### Lifecycle

**Single Instance (a.k.a. Singleton)**

```ts
let cont = createContainer().add({
  oven: () => new Oven(),
})
cont.get("oven") === cont.get("oven") // true
```

**Transient**

```ts
let cont = createContainer().add({
  oven: () => () => new Oven(),
})
cont.get("oven") === cont.get("oven") // false
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
let cont = createContainer().add({
  kitchen: async () => provideKitchenContainer(),
})

// Next line will load `./kitchen/kitchen` module
await cont.items.kitchen

// Next line will load `./kitchen/oven` module
await cont.items.kitchen.oven
```

## Getting Started

The best way to get started is to check [a CRA Pizza example](https://github.com/molszanski/iti/tree/master/examples/cra/src/containers)

## Typescript

Iti has a great typescript support. All types are resolved automatically and checked at compile time.

![Autocomplete](./docs/1.png)
![Autocomplete](./docs/2.png)
![Autocomplete](./docs/3.png)
![Autocomplete](./docs/4.png)

## Docs

Read more at [itijs.org/docs/api](https://itijs.org/docs/api#api-documentation-js--ts)

**Notable inspiration**

- https://github.com/nicojs/typed-inject
- https://github.com/microsoft/tsyringe
- https://github.com/asvetliakov/Huject
  https://github.com/jeffijoe/awilix
- https://github.com/typestack/typedi
- https://github.com/inversify/InversifyJS
