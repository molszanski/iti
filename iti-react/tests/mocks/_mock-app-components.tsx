import React, { useContext, useMemo, ReactNode } from "react"
import { generateEnsureContainerSet } from "../../src/index"
import { useMockAppItemSet, MyRootCont } from "./_mock-app-hooks"
import { getMainMockAppContainer } from "./_mock-app-container"

const x = generateEnsureContainerSet(() =>
  useMockAppItemSet(["aCont", "bCont"]),
)
export const EnsureNewKitchenConainer = x.EnsureWrapper
export const useNewKitchenContext = x.contextHook

export function MockAppWrapper({ children }: { children?: ReactNode }) {
  const store = useMemo(() => getMainMockAppContainer(), [])

  return <MyRootCont.Provider value={store}>{children}</MyRootCont.Provider>
}
