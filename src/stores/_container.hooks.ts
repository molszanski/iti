import React, { useContext, useState, useEffect } from "react"
import { useGenericContainer, ContainerGeneric } from "../library/library.hooks"
import type { A_Container } from "./container.a"
import type { AuthContainer } from "./container.auth"
import type { B_Container } from "./container.b"
import type { AppContainer } from "./_root.store"

export const RootStoreContext = React.createContext<AppContainer>({} as any)
export function useRootStore(): AppContainer {
  const store = useContext(RootStoreContext)
  return store
}

export function useAuthContainer(): ContainerGeneric<AuthContainer> {
  const root = useRootStore()
  return useGenericContainer(root.getAuthContainer())
}

export function useAContainer(): ContainerGeneric<A_Container> {
  const root = useRootStore()
  return useGenericContainer(root.getA_Container())
}

export function useBContainer(): ContainerGeneric<B_Container> {
  const root = useRootStore()
  return useGenericContainer(root.getB_Container())
}
