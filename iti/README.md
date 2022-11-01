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

const node = createContainer()
  .add({
    oven: () => new Oven(),
    userManual: async () => "Please preheat before use",
  })
  .add((ctx) => ({
    kitchen: async () => new Kitchen(ctx.oven, await ctx.userManual),
  }))

await node.get("kitchen") // Kitchen
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
root.get("oven") // Creates a new Oven instance
root.get("oven") // Gets a cached Oven instance

await node.get("kitchen") // { kitchen: Kitchen } also cached
await node.items.kitchen // same as above

// Get multiple instances at once
await root.getContainerSet(["oven", "userManual"]) // { userManual: '...', oven: Oven }
await root.getContainerSet((c) => [c.userManual, c.oven]) // same as above

// Plain deletion
node.delete("kitchen")

// Subscribe to container changes
node.subscribeToContainer("oven", (oven) => {})
node.subscribeToContainerSet(["oven", "kitchen"], ({ oven, kitchen }) => {})
// prettier-ignore
node.subscribeToContainerSet((c) => [c.kitchen], ({ oven, kitchen }) => {})
node.on("containerUpdated", ({ key, newContainer }) => {})
node.on("containerUpserted", ({ key, newContainer }) => {})
node.on("containerDeleted", ({ key, newContainer }) => {})
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

## Patterns and tips

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

## Getting Started

The best way to get started is to check [a CRA Pizza example](https://github.com/molszanski/iti/tree/master/examples/cra/src/containers)

Initial wiring

```ts
import { createContainer } from "../../src/library.new-root-container"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  return createContainer()
    .add({ aCont: async () => provideAContainer() })
    .add((containers) => {
      return {
        bCont: async () => provideBContainer(await containers.aCont),
      }
    })
    .add((c) => {
      return {
        cCont: async () => provideCContainer(await c.aCont, await c.bCont, k),
      }
    })
}
```

## Typescript

Iti has a great typescript support. All types are resolved automatically and check at compile time.

![Autocomplete](./docs/1.png)
![Autocomplete](./docs/2.png)
![Autocomplete](./docs/3.png)
![Autocomplete](./docs/4.png)

## Docs

### Tokens

### Containers

Containers are an important unit.
If you replace them, users will be notified. In React it happens automatically

### Events

```ts
const kitchenApp = new RootContainer((ctx) => ({
  // you can use tokens (`oven`, `kitchen`) here and later on
  oven: async () => ovenContainer(),
  kitchen: async () => kitchenContainer(await ctx.oven()),
}))

kitchenApp.on("containerCreated", (event) => {
  console.log(`event: 'containerCreated' ~~> token: '${event.key}'`)
  // `event.container` is also available here
})

kitchenApp.on("containerRequested", (event) => {
  console.log(`event: 'containerRequested' ~~> token: '${event.key}' `)
})

kitchenApp.on("containerRemoved", (event) => {
  console.log(`event: 'containerRemoved' ~~> token: '${event.key}' `)
})

await kitchenApp.items.kitchen

// event: 'containerRequested' ~~> token: 'kitchen'
// event: 'containerRequested' ~~> token: 'oven'
// event: 'containerCreated'   ~~> token: 'oven'
// event: 'containerCreated'   ~~> token: 'kitchen'

// Notice how oven was created before kitchen.
// This is because kitchen depends on oven
```

## API documentation JS / TS

### `createContainer` Setting app root

```ts
import { createContainer } from "../../library.root-container"
export function getMainMockAppContainer() {
  return createContainer().add({ kitchen: () => new Kitchen(/* deps */) })
}
```

### `containers` getter

```ts
let appRoot = getMainPizzaAppContainer()
let kitchen = await appRoot.items.kitchen
kitchen.oven.pizzaCapacity // 4
```

### `getContainerSet`

### `getContainerSetNew`

### `upsert`

When containers are updated React is updated too via hooks

### `delete`

Plainly removes token and value from an instance

### `dispose`

Please check a full [documentation](https://itijs.org/docs/api#disposing) on disposing.

Short version:

```ts
class DatabaseConnection {
  connect(): Promise<void> {}
  disconnect(): Promise<void> {}
}
const container = createContainer()
  .add(() => ({
    dbConnection: async () => {
      const db = new DatabaseConnection()
      await db.connect()
      return db
    },
  }))
  .addDisposer({
    //              ↓ `db` is a resolved value of a `dbConnection` token. Pretty handy
    dbConnection: (db) => db.disconnect(),
  })

const db = await container.get("dbConnection")
await container.disposeAll()
```

# Alternatives

## No async support

Existing libraries like inversify and others don’t support asynchronous code.

They either provide a promise to your constructor or require one to imperatively execute all potentially async code before the binding phase.

This is far from ideal.

## Heavy use of decorators

Secondly, they rely on decorators and `reflect-metadata`

Decorators create unnecessary coupling of an application business logic with a framework. The whole idea of DI is to decouple the application business logic. Coupling classes with a DI framework is still coupling and turns DI into a service locator.

Also, decorator support is an experimental feature in Typescript and current implementation is not compatible with the TC39 proposal. This will probably cause problems for any non-trivial decorators and babel hacks.

In addition to that it is very hard to use `reflect-metadata` with starters like CRA, Next.js etc. To use `reflect-metadata` you need to tweak your compilers (babel, typescript, esbuild, swc etc.) configuration. So if you can’t use `reflect-metadata` you can’t use `inversify` or `tsyringe`.

## Comparison with `inversifyjs`, `tsyringe` and others

Inversion of Control (IoC) is a great way to decouple code and the most popular pattern of IoC is dependency injection (DI) [but it is not limited to one](https://martinfowler.com/articles/injection.html).

In JavaScript there is not way to create a dependency injection without mixing application business logic with a specific IoC library code or hacking a compiler (reflect-metadata).

**`inversifyjs` and `tsyringe` use decorators and `reflect-metadata`**

```ts
import { injectable } from "tsyringe"

@injectable()
class Foo {
  constructor(private database: Database) {}
}

// some other file
import "reflect-metadata"
import { container } from "tsyringe"
import { Foo } from "./foo"

const instance = container.resolve(Foo)
```

**`typed-inject` uses monkey-patching**

```ts
import { createInjector } from "typed-inject"
function barFactory(foo: number) {
  return foo + 1
}
barFactory.inject = ["foo"] as const
class Baz {
  constructor(bar: number) {
    console.log(`bar is: ${bar}`)
  }
  static inject = ["bar"] as const
}
```

With Iti your application business logic is not mixed with the framework code

```ts
import type { Ingredients } from "./store.ingredients"
import type { Oven } from "./store.oven"

export class Kitchen {
  constructor(private oven: Oven, private ingredients: Ingredients) {}
}

// provider / factory
import { IngredientsService } from "../services/ingredients-manager"
import { Kitchen } from "../stores/store.kitchen"
import { Oven } from "../stores/store.oven"

export async function provideKitchenContainer() {
  let oven = new Oven()
  let ingredients = await IngredientsService.buySomeIngredients()
  let kitchen = new Kitchen(oven, ingredients)

  return {
    oven: oven,
    ingredients: ingredients,
    kitchen: kitchen,
  }
}
```

Notable inspirations:

- https://github.com/inversify/InversifyJS
- https://github.com/microsoft/tsyringe
- https://github.com/nicojs/typed-inject
- https://github.com/asvetliakov/Huject
- https://github.com/typestack/typedi

## Questions and tips

**Can I have multiple application containers?**

Yes, no problem at all. If you want, they can even share tokens and hence instances!

**Why `getContainerSet` is always async?**

This is temporary(?) limitation to keep typescript happy and typescript types reasonable sane

[^1]: Kudos to [typed-inject](https://github.com/nicojs/typed-inject) for finding a reasonable alternative to decorators and Reflect. Sadly, it doesn't support async and there are some other limits
