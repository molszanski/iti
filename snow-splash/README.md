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

Snow-Splash relies Containers provide a usefull grouping and forms a DAG (directed acyclic graph) that initializes on demand.

## Usage

```js
npm install -S snowsplash

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

Javascript is not Java or C# and it does not provide advanced OO constructs. Libraries like InversifyJS or tsyringe rely on decorators and `reflect-metadata` to enable DI.

This has a major downside as it "pollutes" your business logic code with framework decorator imports, magic variables or other lock in.

Notable inspirations:

- https://github.com/inversify/InversifyJS
- https://github.com/microsoft/tsyringe
  https://github.com/microsoft/tsyringe
  https://github.com/typestack/typedi
  https://github.com/nicojs/typed-inject
  https://github.com/asvetliakov/Huject

## Docs

### Tokens

## old notes

Subjects:

- event emitter: Rather domain scoped
- hidden agenda / goal: share containeres and stores between projects

Containers:

- what about instances shared between multiple containers? No!
- Can we create "combined" contaners? Ok!

Notes:

Sometimes we will need mobx transaction feature
