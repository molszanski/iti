import React, { useContext, useEffect, useState } from "react"
import { useNewDandy, useContainerSet } from "../containers/_container.hooks"
import type { Kitchen_Container } from "../containers/container.kitchen"
import type { PizzaPlace_Container } from "../containers/container.pizza-place"
import { observer } from "mobx-react-lite"
import { AuthContainer } from "../containers/container.auth"
import { KitchenManipulator_Container } from "../containers/container.kitchein-manipulator"

export interface EnsureKitchenContext {
  kitchen: Kitchen_Container
  pizzaContainer: PizzaPlace_Container
  auth: AuthContainer
  kitchenManipulator: KitchenManipulator_Container
}
export const EnsureKitchenReactContext =
  React.createContext<EnsureKitchenContext>({} as any)

export function useKitchenContext() {
  return useContext(EnsureKitchenReactContext)
}

export const EnsureKitchenConainer = (props: { children: React.ReactNode }) => {
  let containerSet = useContainerSet([
    "kitchen",
    "pizzaContainer",
    "auth",
    "kitchenManipulator",
  ])

  if (!containerSet) return <>Pizza Place is loading</>

  return (
    <EnsureKitchenReactContext.Provider value={containerSet}>
      {props.children}
    </EnsureKitchenReactContext.Provider>
  )
}
