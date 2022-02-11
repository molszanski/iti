import React, { useContext } from "react"

export function generateEnsureContainerSet<Hook extends (...args: any) => any>(
  containerSetGetterHook: Hook,
) {
  type ContainerSetContext = ReturnType<typeof containerSetGetterHook>

  const EnsureReactContext = React.createContext<ContainerSetContext>({} as any)

  function useThatContext() {
    return useContext(EnsureReactContext)
  }

  const EnsureConainer = (props: {
    fallback?: JSX.Element
    children: React.ReactNode
  }) => {
    let containerSet = containerSetGetterHook()
    if (!containerSet) {
      if (props.fallback) {
        return props.fallback
      } else {
        return null
      }
    }

    return React.createElement(
      EnsureReactContext.Provider,
      { value: containerSet },
      props.children,
    )
  }

  return {
    EnsureWrapper: EnsureConainer,
    contextHook: useThatContext,
  }
}
