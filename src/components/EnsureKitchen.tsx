import React, { useContext } from "react"
import { useContainerSet } from "../containers/_container.hooks"
import { generateEnsureContainerSet } from "../_library/library.generate-ensure-hooks"

const x = generateEnsureContainerSet(() =>
  useContainerSet(["kitchen", "pizzaContainer", "auth"]),
)
export const EnsureNewKitchenConainer = x.EnsureWrapper
export const useNewKitchenContext = x.contextHook
