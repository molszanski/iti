import React, { useContext } from "react"

export function generateEnsureItemSet<ItemSetContext>(
  itemSetGetterHook: (...args: any) => [ItemSetContext, any],
) {
  const EnsureReactContext = React.createContext<ItemSetContext>({} as any)

  function useThatContext() {
    return useContext(EnsureReactContext)
  }

  const EnsureContainer = (props: {
    fallback?: React.ReactNode
    children: React.ReactNode
  }) => {
    let [itemSet, err] = itemSetGetterHook()
    if (!itemSet || err != null) {
      if (props.fallback) {
        return props.fallback
      } else {
        return null
      }
    }

    return React.createElement(
      EnsureReactContext.Provider,
      { value: itemSet },
      props.children,
    )
  }

  return {
    EnsureWrapper: EnsureContainer,
    contextHook: useThatContext,
  }
}
