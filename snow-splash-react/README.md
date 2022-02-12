<a href="https://www.npmjs.org/package/snow-splash"><img src="https://img.shields.io/npm/v/snow-splash.svg" alt="npm"></a>
![CI](https://github.com/molszanski/snow-splash/actions/workflows/lib-test.yml/badge.svg)
<a href="https://unpkg.com/snow-splash/dist/snow-splash.modern.js"><img src="https://img.badgesize.io/https://unpkg.com/snow-splash/dist/snow-splash.modern.js?compression=gzip" alt="gzip size"></a>

🚧 **library is in alpha dev mode** 🚧

# Snow Splash React

> ~2kB inversion of control container for Typescript/Javascript for constructor injection with a focus on async flow

- **fully async:** merges async code and a constructor injection via async functions

## Usage

```
npm install -S snow-splash-react
```

### Basic Usage

```ts
// React
export const PizzaData = () => {
  const kitchenSet = useContainerSet(["oven", "kitchen"])
  if (!kitchenSet) return <>Kitchen is loading </>
  let inOven = kitchenSet.oven.pizzasInOven()
  return <>Pizzaz In Oven: {inOven}</>
}
```

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

**Why `getContainerSet` and others are always async?**

This is temporary(?) limitation to keep typescript happy and typescript types reasonable sane

**Why do I need to use `seal` / `resolve` to close `addNode` chain?**

Basically, there are two options: chain and pipe. Implementing `pipe` to be typesafe

```js
// Syntax 1
let n1 = await Node()
  .addNode({ a: "A", b: "B" })
  .addNode((node) => ({
    ab: node.get("a") + node.get("b"),
    c: async () => "C",
  }))
  .addNode(async (node) => ({
    ac: node.get("a") + (await node.get(c)),
  }))
  .seal()

// Syntax 2
let n2 = await Node().pipe(
  { a: "A", b: "B" },
  (node) => ({
    ab: node.get("a") + node.get("b"),
    c: async () => "C",
  }),
  async (node) => ({
    ac: node.get("a") + (await node.get(c)),
  }),
)
```

**Why nodes run twice?**

```ts
let node = await makeRoot()
  .addPromise(async () => ({
    a: "A",
  }))
  .addPromise(async (c) => {
    console.log("containers:", c.get("a"))
    return {
      c: () => "C",
    }
  })
  .seal()
// prints: "containers: undefined"

node.get("c") // prints: "containers: defined"
```
