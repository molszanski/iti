import React, { useContext } from "react"
import { generateEnsureContainerSet } from "snow-splash-react"
import { useContainerSet } from "../containers/_container.hooks"

const x = generateEnsureContainerSet(() =>
  useContainerSet(["kitchen", "pizzaContainer", "auth"]),
)
export const EnsureNewKitchenConainer = x.EnsureWrapper
export const useNewKitchenContext = x.contextHook
