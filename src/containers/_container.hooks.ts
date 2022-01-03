import _ from "lodash"
import React, { useContext } from "react"
import { useRootStores } from "../_library/library.hooks"
import type { getMainPizzaAppContainer } from "./_root.store"

export const RootStoreContext2 = React.createContext<
  ReturnType<typeof getMainPizzaAppContainer>
>({} as any)
function useRoot2() {
  let k = useContext(RootStoreContext2)
  return k
}

export function useNewDandy() {
  const root = useRoot2()
  return useRootStores(root.providerMap, root)
}
