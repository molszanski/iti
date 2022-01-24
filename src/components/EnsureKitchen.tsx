import React, { useContext } from "react"
import { useContainerSet } from "../containers/_container.hooks"

function generateHooks<Hook extends (...args: any) => any>(
  containerSetGetterHook: Hook,
) {
  type ContainerSetContext = ReturnType<typeof containerSetGetterHook>

  const EnsureReactContext = React.createContext<ContainerSetContext>({} as any)

  function useThatContext() {
    return useContext(EnsureReactContext)
  }

  const EnsureConainer = (props: {
    fallback: React.ReactNode
    children: React.ReactNode
  }) => {
    let containerSet = containerSetGetterHook()
    if (!containerSet) return <>Pizza Place is loading</>

    return (
      <EnsureReactContext.Provider value={containerSet}>
        {props.children}
      </EnsureReactContext.Provider>
    )
  }

  return {
    EnsureWrapper: EnsureConainer,
    contextHook: useThatContext,
  }
}

const x = generateHooks(() =>
  useContainerSet(["kitchen", "pizzaContainer", "auth"]),
)

export const EnsureNewKitchenConainer = x.EnsureWrapper
export const useNewKitchenContext = x.contextHook
