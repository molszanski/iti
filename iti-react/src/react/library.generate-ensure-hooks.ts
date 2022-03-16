import React, { useContext } from "react"

export function generateEnsureContainerSet<ContainerSetContext>(
  containerSetGetterHook: (...args: any) => [ContainerSetContext, any],
) {
  const EnsureReactContext = React.createContext<ContainerSetContext>({} as any)

  function useThatContext() {
    return useContext(EnsureReactContext)
  }

  const EnsureConainer = (props: {
    fallback?: JSX.Element
    children: React.ReactNode
  }) => {
    let [containerSet, err] = containerSetGetterHook()
    if (!containerSet || err != null) {
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
