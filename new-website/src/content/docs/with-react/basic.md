---
title: Basic React Usage
description: Basic usage of ITI with React
---

# Ensure Sync Containers

_work in progress_

```tsx title="./src/_containers-react/EnsureEcommerce.tsx"
import React, { useContext } from "react"
import { generateEnsureContainerSet } from "iti-react"
import { useContainerSet } from "./_editor-app-hooks"

const x = generateEnsureContainerSet(() =>
  useContainerSet(["ecommerce", "auth"])
)
export const EnsureEcommerceContainer = x.EnsureWrapper
export const useEcommerceContext = x.contextHook
```

```tsx title="./src/App.tsx"
import { EnsureEcommerceContainer } from "./_containers-react/EnsureEcommerce"

export const App = () => (
  <div className="App">
    <EnsureEcommerceContainer fallback={<>Loading</>}>
      <MainApp />
    </EnsureEcommerceContainer>
  </div>
)
```

```tsx title="./src/Currency.tsx"
import { useEcommerceContext } from "../../../../_containers-react/EnsureEcommerce"

export const CurrencyInfo = () => {
  const { currencyStore, taxStore } = useEcommerceContext().ecommerce

  return <div>{currencyStore.currency}</div>
}
```
