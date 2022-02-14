import React, { useContext } from "react"
import { generateEnsureContainerSet } from "iti-react"
import { useContainerSet } from "../containers/_container.hooks"

const x = generateEnsureContainerSet(() =>
  useContainerSet(["kitchen", "pizzaContainer", "auth"]),
)
export const EnsureKitchenProvider = x.EnsureWrapper
export const useNewKitchenContext = x.contextHook
