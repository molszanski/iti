<p align="center">
  <a href="https://itijs.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="./docs/logo.svg" alt="ITI Logo">
  </a>
</p>

<div align="center">

# Iti React

<h4>~1kB Dependency Injection Library for Typescript and React with a unique <strong>async flow</strong> support</h4>

<p align="center">
  <a href="https://github.com/molszanski/iti/actions?query=branch%3Amaster"><img src="https://github.com/molszanski/iti/actions/workflows/lib-test.yml/badge.svg" alt="CI Status"></a>
  <a href="https://www.npmjs.org/package/iti-react"><img src="https://img.shields.io/npm/v/iti-react.svg" alt="npm version"></a>
  <a href="https://unpkg.com/iti-react/dist/iti-react.modern.js"><img src="https://img.badgesize.io/https://unpkg.com/iti-react/dist/iti-react.modern.js?compression=gzip" alt="gzip size"></a>
</p>

</div>

## Usage

```
npm install -S iti-react
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
import { getContainerSetHooks } from "iti-react"
import { getProviders, PizzaAppContainer } from "./_root.store"

export const MyRootCont = React.createContext(<PizzaAppContainer>{})

let mega = getContainerSetHooks(getProviders, MyRootCont)
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
import { generateEnsureContainerSet } from "iti-react"

const x = generateEnsureContainerSet(() =>
  useContainerSet(["kitchen", "pizzaContainer", "auth"]),
)
export const EnsureNewKitchenContainer = x.EnsureWrapper
export const useNewKitchenContext = x.contextHook
```

```tsx
export const PizzaApp = () => {
  return (
    <div>
      Pizza App:
      <EnsureNewKitchenContainer
        fallback={<>Pizza App is still loading please wait</>}
      >
        <NewPizzaPlaceControls />
      </EnsureNewKitchenContainer>
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

## Questions and tips
