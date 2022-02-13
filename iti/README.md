<p align="center">
  <a href="https://www.npmjs.org/package/iti">
    <img src="https://img.shields.io/npm/v/iti.svg" alt="npm">
  </a>
  <a href="https://unpkg.com/iti/dist/iti.modern.js">
    <img src="https://img.badgesize.io/https://unpkg.com/iti/dist/iti.modern.js?compression=gzip" alt="gzip size">
  </a>
  <a href="https://github.com/molszanski/iti/actions/workflows/lib-test.yml/badge.svg">
    <img src="https://github.com/molszanski/iti/actions/workflows/lib-test.yml/badge.svg" alt="CI">
  </a>
  <br/>
  <strong>🚧 library is in an alpha mode 🚧</strong>
</p>

# Iti

> ~1kB inversion of control container for Typescript/Javascript for constructor injection with a focus on async flow

- **fully async:** merges async code and constructor injection via plain async functions
- **non-invasive:** does not require imported `@decorators` or framework `extends` in your application logic
- **lazy:** initialises your app modules and containers on demand
- **strongly typed:** has great IDE autocomplete and compile time check. Without any [manual type casting](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#containergettserviceidentifier-interfacesserviceidentifiert-t)
- **split chunks:** enables [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) via a [one liner](#dynamic-imports) thanks to a fully async core
- **React friendly:** has useful [React bindings](https://github.com/molszanski/iti/tree/master/iti-react) to help you separate application logic and a React view layer
- **starter friendly:** works with starters like [Create React App](https://create-React-app.dev/) or [Next.js](https://nextjs.org/docs/getting-started) unlike existing libraries
- **no Babel config:** doesn't require `reflect-metadata` or decorators so there is no need to hack in decorator and `"decoratorMetadata"` support in to your build configs
- **tiny:** less than 1kB

Iti is an alternative to [InversifyJS](https://github.com/inversify/InversifyJS) and [microsoft/tsyringe](https://github.com/microsoft/tsyringe). It relies on plain JS functions, objects and familiar patterns. There is no need to learn complex API to use it in a full capacity.

## Usage

```
npm install -S iti
```

### Basic Usage

```tsx
// Step 1: Your application logic stays clean
class Oven {
  public pizzasInOven() {
    return 3
  }
  public async preheat() {}
}
class Kitchen {
  constructor(public oven: Oven, public manual: string) {}
}

// Step 2: Add sync and async dependencies
import { makeRoot } from "iti"
let root = makeRoot()
  .add({
    userManual: "Please preheat before use",
    oven: () => new Oven(),
  })
  .add((containers) => ({
    kitchen: async () => {
      await containers.oven.preheat()
      return new Kitchen(containers.oven, containers.userManual)
    },
  }))

// Step 3: Read data
root.get("oven") // Oven
await root.get("kitchen") // Kitchen

// Typical React usage
export const PizzaData = () => {
  const [oven] = useContainer().oven
  return <> Pizzaz In Oven: {oven.pizzasInOven()}</>
}
```

### Why another library?

The main reason is that existing libraries don’t support asynchronous code. They either provide a promise to your constructor or require one to imperatively execute all potentially async code before the binding phase. Far from ideal.

This is the reason I started the project

Secondly, they rely on decorators and `reflect-metadata`

Decorators create unnecessary coupling of an application logic with a framework. The whole idea of DI is to decouple the application logic. Coupling classes with a DI framework is still coupling and turns DI into a service locator.

Also, decorator support is an experimental feature in Typescript and current implementation is not compatible with the TC39 proposal. This will probably cause problems for any non-trivial decorators and babel hacks.

In addition to that it is very hard to use `reflect-metadata` with starters like CRA, Next.js etc. To use `reflect-metadata` you need to tweak your compilers (babel, typescript, esbuild, swc etc.) configuration. So if you can’t use `reflect-metadata` you can’t use `inversify` or `tsyringe`.

## Short Manual

**Reading**

```ts
// Get a single instance
root.get("oven") // Creates a new Oven instance
root.get("oven") // Gets a cached Oven instance

await node.get("kitchen") // { kitchen: Kitchen } also cached
await node.containers.kitchen // same as above

// Get multiple instances at once
await root.getContainerSet(["oven", "userManual"]) // { userManual: '...', oven: Oven }
await root.getContainerSet((c) => [c.userManual, c.oven]) // same as above

// Subscribe to container changes
node.subscribeToContiner("oven", (oven) => {})
node.subscribeToContinerSet(["oven", "kitchen"], ({ oven, kitchen }) => {})
// prettier-ignore
node.subscribeToContinerSet((c) => [c.kitchen], ({ oven, kitchen }) => {})
node.on("containerUpdated", ({ key, newContainer }) => {})
node.on("containerUpserted", ({ key, newContainer }) => {})
```

**Writing**

```ts
let node1 = makeRoot()
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

### Single Instance (a.k.a. Singleton)

```ts
import { Oven, Kitchen } from "./kitchen/"
export async function provideKitchenContainer() {
  const oven = new Oven()
  await oven.preheat()

  return {
    kitchen: new Kitchen(),
    oven: oven,
  }
}
```

### Transient

```ts
import { Oven, Kitchen } from "./kitchen/"
export async function provideKitchenContainer() {
  return {
    kitchen: () => new Kitchen(),
    oven: async () => {
      const oven = new Oven()
      await oven.preheat()
      return oven
    },
  }
}
```

### Dynamic Imports

```ts
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

### Tip: Prefer callbacks over of strings (in progress)

If you use callback pattern across your app, you will be able to mass rename your containerKeys using typescript. With strings, you will have to manually go through the app. On the bright side, compiler will not compile until you fix your rename manually across the app.

```ts
const node = makeRoot().addNode({
  a: "A",
  b: "B",
})

await node.get((containerKeys) => containerKeys.a) // BEST!!!
await node.get("a") // it will work but...
```

### Tip: Prefer sealing your node

This will help resolve some very exotic race conditions with subscriptions and container updates. We internally `seal()` our node on every `get` request but you can do it too before non trivial operations

```ts
await makeRoot()
  .addPromise(async () => ({
    a: "A",
    b: "B",
  }))
  .seal() // Good
```

## Anti Patterns

## Getting Started

The best way to get started is to check [a CRA Pizza example](https://github.com/molszanski/iti/tree/master/examples/cra/src/containers)

Initial wiring

```ts
import { makeRoot } from "../../src/library.new-root-container"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

export type MockAppNode = ReturnType<typeof getMainMockAppContainer>
export function getMainMockAppContainer() {
  let node = makeRoot()
  let k = node
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
  return k
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
  // `event.container` is also avaliable here
})

kitchenApp.on("containerRequested", (event) => {
  console.log(`event: 'containerRequested' ~~> token: '${event.key}' `)
})

kitchenApp.on("containerRemoved", (event) => {
  console.log(`event: 'containerRemoved' ~~> token: '${event.key}' `)
})

await kitchenApp.containers.kitchen

// event: 'containerRequested' ~~> token: 'kitchen'
// event: 'containerRequested' ~~> token: 'oven'
// event: 'containerCreated'   ~~> token: 'oven'
// event: 'containerCreated'   ~~> token: 'kitchen'

// Notice how oven was created before kitchen.
// This is because kitcen depends on oven
```

## API documentation JS / TS

### `makeRoot` Setting app root

```ts
import { makeRoot, RootContainer } from "../../library.root-container"
export function getMainMockAppContainer() {
  // check get providers above
  return makeRoot(getProviders)
}
```

### `containers` getter

```ts
let appRoot = getMainPizzaAppContainer()
let kitchen = await appRoot.containers.kitchen
kitchen.oven.pizzaCapacity // 4
```

### `getContainerSet`

### `getContainerSetNew`

### `upsert`

When containers are updated React is updated too via hooks

## Comparison with `inversifyjs`, `tsyringe` and others

Inversion of Control (IoC) is a great way to decouple the application and the most popular pattern of IoC is dependency injection (DI) [but it is not limited to one](https://martinfowler.com/articles/injection.html).

In JavaScript there is not way to create a dependency injection without mixing application logic with a specific IoC library code or hacking a compiler (reflect-metadata).

**`inversifyjs` and `tsyringe` use decorators and `reflect-metada`**

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

With Iti your application logic is not mixed with the framework code

```ts
import type { Ingredients } from "./store.ingrediets"
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
