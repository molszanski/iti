---
title: React Configuration
description: How to configure ITI with React
---

# Full Example Configuration

Basically, we create an ITI instance, add it to `React.Context` and generate fetch hooks.

```tsx title="./src/_containers/main-app"
import { createContainer } from "iti"

export const mainApp = () =>
  createContainer().add(() => ({
    auth: async () => {
      const res = await fetch("/api/profile")
      return {
        profile: res.json(),
      }
    },
  }))
export type MainAppContainer = ReturnType<typeof mainApp>
```

```tsx title="./src/_containers/hooks"
import React from "react"
import { getContainerSetHooks } from "iti-react"
import { MainAppContainer } from "./_containers/main-app"

export const MyAppContext = React.createContext<MainAppContainer>({})

const hooks = getContainerSetHooks(MyAppContext)
export const useContainerSet = hooks.useContainerSet
export const useContainer = hooks.useContainer
```

```tsx title="./src/App.tsx"
import React, { useContext } from "react"
import { mainApp } from "./_containers/main-app"
import { MyAppContext } from "./_containers/hooks"
import { Profile } from "./Profile"

function App() {
  const itiContainerInstance = useMemo(() => mainApp(), [])

  return (
    <>
      <MyAppContext.Provider value={itiContainerInstance}>
        <Profile />
      </MyAppContext.Provider>
    </>
  )
}
```

```tsx title="./src/Profile.tsx"
import { useContainer } from "./_containers/main-app"

function Profile() {
  const [auth, authErr] = useContainer().auth

  if (authErr) return <div>failed to load</div>
  if (!auth) return <div>loading...</div>

  return <div>hello {auth.profile.name}!</div>
}
```
