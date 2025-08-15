---
title: Full React Example
description: Complete example of using ITI with React
---


# Basic Usage with React

_work in progress_

Fetching sync and async dependencies from ITI in React is conceptually similar to data fetching. If you've used libraries like [React Query](https://react-query.tanstack.com/), [swr](https://swr.vercel.app/), [Apollo Client](https://www.apollographql.com/docs/react/) or similar this will feel familiar.

## Data fetching

<Tabs>
<TabItem value="swr" label="SWR">

```tsx title="./src/Profile.tsx"
import useSWR from "swr"

function Profile() {
  const { data, error } = useSWR("/api/user", fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

</TabItem>
<TabItem value="rq" label="React-Query">

```tsx title="./src/Profile.tsx"
import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import axios from "axios"

export function Profile() {
  const { isLoading, error, data, isFetching } = useQuery("userData", () =>
    axios.get("/api/user").then((res) => res.data)
  )

  if (isLoading) return "Loading..."
  if (error) return "An error has occurred: " + error.message

  return <div>hello {data.name}!</div>
}
```

</TabItem>

<TabItem value="ap" label="Apollo Client">

```tsx title="./src/Profile.tsx"
import { gql, useQuery } from "@apollo/client"

const GET_PROFILE_QUERY = gql`
  query GetProfile {
    profile {
      id
      name
    }
  }
`

function Profile() {
  const { loading, error, data } = useQuery(GET_PROFILE_QUERY)

  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`

  return <div>hello {data.name}!</div>
}
```

</TabItem>

</Tabs>

## Async Request for single item in ITI

```tsx title="./src/Profile.tsx"
import { useContainer } from "./_containers/main-app"

function Profile() {
  const [auth, authErr] = useContainer().auth

  if (authErr) return <div>failed to load</div>
  if (!auth) return <div>loading...</div>

  return <div>hello {auth.profile.name}!</div>
}
```

## Async Request for multiple items

**`useContainerSet`**

```tsx title="./src/Profile.tsx"
import { useContainer, useContainerSet } from "./_containers/main-app"

// Callback style

function Profile() {
  const [profileDeps, profileDepsErr] = useContainerSet((c) => [c.auth, c.env])

  if (!profileDeps || profileDepsErr) return null
  const { auth, env } = profileDeps

  return <div>hello {auth.profile.name}!</div>
}

// Literal style
function Profile() {
  const [profileDeps, profileDepsErr] = useContainerSet(["auth", "env"])

  if (!profileDeps || profileDepsErr) return null
  const { auth, env } = profileDeps

  return <div>hello {auth.profile.name}!</div>
}
```

## Ensure Sync Containers

You might want a simpler API for your components

So we could go

**From:**

```tsx
const [profileDeps, profileDepsErr] = useContainerSet(["auth", "env"])
if (!profileDeps || profileDepsErr) return null
```

**To:**

```tsx
const { auth, env } = useProfileDeps()
```

To achieve that we will have to create a wrapping component. Very similar to React.Suspense

```tsx
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import("./OtherComponent"))

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  )
}
```

We will create a wrapping component that will fetch dependencies, provide fallback and provide context for nested components

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
