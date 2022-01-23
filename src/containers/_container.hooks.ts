import _ from "lodash"
import React, { useContext, useEffect, useState } from "react"
import { useRootStores } from "../_library/library.hooks"
import { UnPromisify } from "../_library/_utils"
import { getMainPizzaAppContainer, getProviders } from "./_root.store"

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

type ContainerGetter<
  providerFun extends (...args: any) => any,
  token extends string,
> = UnPromisify<ReturnType<ReturnType<providerFun>[token]>>

type ContainerKeys<providerFun extends (...args: any) => any> =
  keyof ReturnType<providerFun>

type ContainerSet<
  Token extends string,
  providerFun extends (...args: any) => any,
> = {
  [S in Token]: ContainerGetter<providerFun, S>
}

export function useContainerSet<
  Token extends ContainerKeys<typeof getProviders>,
>(b: Token[]): ContainerSet<Token, typeof getProviders> {
  const [all, setAll] = useState<ContainerSet<Token, typeof getProviders>>(
    null as any,
  )
  const root = useRoot2()

  useEffect(() => {
    root.getContainerSet(b).then((contSet) => {
      setAll(contSet)
    })
  }, b)

  return all
}
