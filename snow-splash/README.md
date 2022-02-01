<a href="https://www.npmjs.org/package/snow-splash"><img src="https://img.shields.io/npm/v/snow-splash.svg" alt="npm"></a>
![CI](https://github.com/molszanski/snow-splash/actions/workflows/lib-test.yml/badge.svg)
<a href="https://unpkg.com/snow-splash/dist/snow-splash.modern.js"><img src="https://img.badgesize.io/https://unpkg.com/snow-splash/dist/snow-splash.modern.js?compression=gzip" alt="gzip size"></a>
<a href="https://unpkg.com/snow-splash/dist/snow-splash.modern.js"><img src="https://img.badgesize.io/https://unpkg.com/snow-splash/dist/snow-splash.modern.js?compression=brotli" alt="brotli size"></a>

🚧 **library is in alpha dev mode** 🚧

# Snow Splash

> ~1kB inversion of control constructor injection container for Typescript/Javascript with a focus on async flow

- **fully async:** merges async and a constructor injection via an async function (asynchronous factory pattern)
- **non-invasive:** does not force framework `extends` or library `@decorators` in your application logic
- **lazy:** initializes your app modules on demand
- **split-chunks:** core is fully async and it provides a way to split application logic into chunks
- **typesafe:** works with typescript without [manual type casting](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#containergettserviceidentifier-interfacesserviceidentifiert-t)
- **react:** has useful react bindings to help separate application logic and react view layer
- **lightweight:** doesn't rely on 'reflect-metadata' or decorators
- **tiny:** less than 1kB

Snow-Splash is an alternative to [InversifyJS](https://github.com/inversify/InversifyJS) and [microsoft/tsyringe](https://github.com/microsoft/tsyringe). It relies on plain JS functions and familiar patterns, so no need to learn complex API to be an IoC ninja.

## Usage

```
npm install -S snow-splash
```

```js
// STEP 1: Define Containers that group your application logic

import { RootContainer } from "snow-splash"
import { Oven, Kitchen, OrderManager } from "./kitchen/"
import { PizzaPlace, DiningTables } from "./pizza-place/"

// async function that returns object of any shape. Acts as async factory
export async function provideKitchenContainer() {
  const oven = new Oven()
  await oven.preheat()

  return {
    oven: oven,
    kitchen: new Kitchen(oven),
  }
}

// pizzaContainer depenends on kitchenContainer.
export async function providePizzaPlaceContainer(kitchenContainer) {
  return {
    pizzaPlace: new PizzaPlace(kitchenContainer.kitchen),
    diningTables: new DiningTables(),
  }
}
```

```js
// STEP 2: Wire containers and expose main application container

// core function that wires containers into a DAG
export function getProviders(ctx) {
  return {
    kitchen: async () => provideKitchenContainer(),
    pizzaContainer: async () => providePizzaPlaceContainer(await ctx.kitchen()),
  }
}
export function getMainPizzaAppContainer() {
  return new RootContainer(getProviders)
}
```

```js
// STEP 3: Use inside your App - Node.js

// -- Node.js

import { getMainPizzaAppContainer } from "./app"
const pizzaApp = getMainPizzaAppContainer()

// lazilly init kithcen and pizza place containers
const { pizzaContainer, kitchen } = await pizzaApp.containers
pizzaContainer.orders.orderPizza()

console.log(`In Oven: ${kitchen.oven.pizzasInOven()}`)
```

```js
// STEP 3: Use inside your App - React - works via context

export const PizzaData = () => {
  const kitchenContainerSet = useContainerSet((c) => [
    c.kitchen,
    c.pizzaContainer,
  ])
  if (!kitchenContainerSet) return <>Kitchen is loading </>
  const { pizzaContainer, kitchen } = kitchenContainerSet

  return (
    <div>
      Pizzaz in Oven: {kitchen.oven.pizzasInOven()}
      <button onClick={() => pizzaContainer.orders.orderPizza()}>
        Order pizza
      </button>
    </div>
  )
}
```

**Why another library?**

Javascript does not provide advanced OO primitives unlike Java or C#. Libraries like InversifyJS or tsyringe rely on decorators and `reflect-metadata` to enable DI.

This has a major downside as it "mixes" your application logic code with framework decorator imports or magic variables. This is can also be a downside since it provides a lock-in.

If two teams in your organization pick two different IoC/DI libs, it would be hard to share code.

## Getting Started

The best way to get started is to check a Pizza example

Initial wiring

```ts
import { makeRoot, RootContainer } from "../../library.root-container"

import { provideAContainer } from "./container.a"
import { provideBContainer } from "./container.b"
import { provideCContainer } from "./container.c"

interface Registry {
  aCont: () => ReturnType<typeof provideAContainer>
  bCont: () => ReturnType<typeof provideBContainer>
  cCont: () => ReturnType<typeof provideCContainer>
}

type Lib = (...args: any) => { [K in keyof Registry]: Registry[K] }
export type MockAppContainer = RootContainer<Lib, ReturnType<Lib>>

function getProviders(ctx: Registry, root: MockAppContainer) {
  return {
    aCont: async () => provideAContainer(),
    bCont: async () => provideBContainer(await ctx.aCont()),
    cCont: async () =>
      provideCContainer(await ctx.aCont(), await ctx.bCont(), root),
  }
}

export function getMainMockAppContainer() {
  return makeRoot(getProviders)
}
```

## Typescript

Snow-Splash has a good typescript support

![Autocomplete](./docs/1.png)
![Autocomplete](./docs/2.png)
![Autocomplete](./docs/3.png)
![Autocomplete](./docs/4.png)

## Patterns

### Single Instance (a.k.a. Singleton)

```ts
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

## Docs

### Tokens

### Containers

Containers are an important unit.
If you replace them, users will be notified. In react it happens automatically

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

### `replaceContainerInstantly`

When containers are updated react is updated too via hooks

## API documentation React

### `getContainerSetHooks`

Generates a set of app specific container hooks

```ts
// my-app-hooks.ts
import React, { useContext } from "react"
import { getContainerSetHooks } from "snow-splash"
import { getProviders, PizzaAppContainer } from "./_root.store"

export const MyRootCont = React.createContext(<PizzaAppContainer>{})

let mega = getContainerSetHooks(getProviders, MyRootCont)
export const useContainerSet = mega.useContainerSet
export const useContainerSet = mega.useContainerSet
```

```tsx
// PizzaData.tsx
import { useContainerSet } from "./my-app-hooks"
export const PizzaData = () => {
  const containerSet = useContainerSet((containers) => [containers.kitchen])
  console.log(containerSet)
  return 123
}
```

### `useContainer`

```ts
export const PizzaData = () => {
  const [kitchenContainer, err] = useContainer().kitchen
  if (!kitchenContainer || err) {
    return <>Kitchen is loading</>
  }

  return <>{kitchenContainer.oven.pizzasInOven}</>
}
```

### `useContainerSet`

Get multiple containers and autosubscribes to change.

```ts
export const PizzaData = () => {
  const containerSet = useContainerSet((containers) => [
    containers.kitchen,
    containers.auth,
  ])
  if (!containerSet) {
    return <>Kitchen is loading</>
  }

  return <>{containerSet.kitchen.oven.pizzasInOven}</>
}
```

###

### `generateEnsureContainerSet`

You can create a simpler API for a portion of your applicatoin to avoid dealing with async in every component. There are some helpfull Context helpers at your service. Also you can use classic props drilling to avoid dealing with async flow in every component

```tsx
import React, { useContext } from "react"
import { useContainerSet } from "../containers/_container.hooks"
import { generateEnsureContainerSet } from "snow-splash"

const x = generateEnsureContainerSet(() =>
  useContainerSet(["kitchen", "pizzaContainer", "auth"]),
)
export const EnsureNewKitchenConainer = x.EnsureWrapper
export const useNewKitchenContext = x.contextHook
```

```tsx
export const PizzaApp = () => {
  return (
    <div>
      Pizza App:
      <EnsureNewKitchenConainer
        fallback={<>Pizza App is still loading please wait</>}
      >
        <NewPizzaPlaceControls />
      </EnsureNewKitchenConainer>
    </div>
  )
}
export const PizzaData = () => {
  const { kitchen, pizzaContainer } = useNewKitchenContext()

  return (
    <div>
      <div>Name: {kitchen.kitchen.kitchenName}</div>
      <div>Tables: {pizzaContainer.diningTables.tables}</div>
    </div>
  )
}
```

## Comparison with `inversifyjs` and `tsyringe`

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

With Snow-Splash your application logic is not mixed with the framework code

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
