🚧 **library is in alpha dev mode** 🚧

# Snow Splash

> ~1kB inversion of control container for Typescript/Javascrith with a focus on async flow

- **fully async:** merges async and constructor injection via an asynchronous Factory (async function)
- **clean:** does not pollute business logic with framework extends, library decorators or magic properties
- **lazy:** initializes your object on demand
- **split-chunks:** because core is fully async it provides a way to split application logic into chunks
- **typesafe:** works well with typescript
- **react:** has useful react bindings to separate your business logic and react view layer
- **lightweight:** doesn't rely on 'reflect-metadata' or decorators
- **tiny:** ~1kB

Snow-Splash relies containers provide usefull grouping. Containers form a DAG (directed acyclic graph) and nodes are initialized on request

## Usage

`npm install -S snow-splash`

```js
// STEP 1: Define Containers

import { RootContainer } from "snow-splash"
import { Oven, Kitchen, OrderManager } from "./kitchen/"
import { PizzaPlace, DiningTables } from "./pizza-place/"

// async function that returns object of any shape. Acts as async factory
export async function provideKitchenContainer() {
  const oven = new Oven()
  await override.preheat()

  return {
    oven: oven,
    kitchen: new Kitchen(oven),
    orderManager: new OrderManager(kitchen),
  }
}

// pizzaContainer depenends on kitchenContainer.
export async function providePizzaPlaceContainer(kitchenContainer) {
  return {
    pizzaPlace: new PizzaPlace(kitchenContainer.kitchen),
    diningTables: new DiningTables(),
  }
}

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

// STEP 3: Use inside your App

// -- Node.js

import { getMainPizzaAppContainer } from "./app"
const pizzaApp = getMainPizzaAppContainer()

// lazilly init kithcen and pizza place containers
const { pizzaContainer, kitchen } = await pizzaApp.containers
pizzaContainer.orders.orderPizza()

console.log(`In Oven: ${kitchen.oven.pizzasInOven()}`)

// -- React - works via context

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

## Motivation

Inversion of Control (IoC) is a great way to decouple the application and the most popular pattern of IoC is dependency injection (DI) [but it is not limited to one](https://martinfowler.com/articles/injection.html).

In JavaScript there is not way to create a dependency injection without polluting business logic with a specific IoC library code, or hacking a compiler.

`snow-splash` provides a pattern to use constructor injection that works in async JS world with all the flexibility you might need at the cost of manually defining providers (async functions) for your code

## Why another library? Alternatives

Javascript does not provide advanced OO primitives unlike Java or C#. Libraries like InversifyJS or tsyringe rely on decorators and `reflect-metadata` to enable DI.

This has a major downside as it "pollutes" your business logic code with framework decorator imports, magic variables or other lock in.

Notable inspirations:

- https://github.com/inversify/InversifyJS
- https://github.com/microsoft/tsyringe
  https://github.com/microsoft/tsyringe
  https://github.com/typestack/typedi
  https://github.com/nicojs/typed-inject
  https://github.com/asvetliakov/Huject

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
  let x = makeRoot(getProviders)
  return x
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

### `replaceCointerInstantly`

When containers are updated react is updated too via hooks

### `replaceCointerAsync`

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
export const useContainerSetNew = mega.useContainerSetNew
```

```tsx
// PizzaData.tsx
import { useContainerSet } from "./my-app-hooks"
export const PizzaData = () => {
  const containerSet = useContainerSetNew((containers) => [containers.kitchen])
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
  const containerSet = useContainerSetNew((containers) => [
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
  useContainerSet(["kitchen", "pizzaContainer", "auth"])
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

## Questions and tips

**Can I have multiple application containers?**

Yes, no problem at all. If you want, they can even share tokens and hence instances!

## old notes

Subjects:

- event emitter: Rather domain scoped
- hidden agenda / goal: share containeres and stores between projects

Containers:

- what about instances shared between multiple containers? No!
- Can we create "combined" contaners? Ok!

Notes:

Sometimes we will need mobx transaction feature
