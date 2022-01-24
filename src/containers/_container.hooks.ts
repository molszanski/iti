import _ from "lodash"
import React, { useContext, useEffect, useState } from "react"
import { useRootStores } from "../_library/library.hooks"
import { UnPromisify } from "../_library/_utils"
import { getProviders, PizzaAppContainer } from "./_root.store"

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

type getAppRootContainer<providerFun extends (a1: any, a2: any) => any> =
  Parameters<providerFun>[1]

function getContainerSetHooks<
  getProviderFunction extends (...args) => { [k: string]: () => Promise<any> },
>(getProviders: getProviderFunction) {
  const f: ContainerKeys<getProviderFunction> = null as any

  type PizzaAppContainer = getAppRootContainer<typeof getProviders>

  const RootStoreContext2 = React.createContext<PizzaAppContainer>({} as any)
  function useRoot2() {
    let k = useContext(RootStoreContext2)
    return k
  }

  function useNewDandy() {
    const root = useRoot2()
    return useRootStores(root.providerMap, root)
  }

  function useContainerSet<
    Token extends ContainerKeys<getProviderFunction> & string,
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

    useEffect(() => {
      root.subscribeToContinerSet(b, (contSet) => {
        setAll(contSet)
      })
    }, b)

    return all
  }

  return {
    f,
    useNewDandy: useNewDandy,
    useContainerSet: useContainerSet,
    RootStoreContext2: RootStoreContext2,
  }
}

export const RootStoreContext2 = React.createContext<PizzaAppContainer>(
  {} as any,
)
export function useRoot2() {
  let k = useContext(RootStoreContext2)
  return k
}

export function useNewDandy() {
  const root = useRoot2()
  return useRootStores(root.providerMap, root)
}

let mega = getContainerSetHooks(getProviders)

export const useContainerSet = mega.useContainerSet
// export const useNewDandy = mega.useNewDandy
// export const RootStoreContext2 = mega.RootStoreContext2
