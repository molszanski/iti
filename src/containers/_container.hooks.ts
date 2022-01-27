import _ from "lodash"
import React, { useContext, useEffect, useState } from "react"
import { useBetterGenericContainer } from "../_library/library.hooks"
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
  AppContanier extends getAppRootContainer<getProviderFunction>,
>(
  getProviders: getProviderFunction,
  reactContext: React.Context<AppContanier>,
) {
  const f: ContainerKeys<getProviderFunction> = null as any

  function useRoot() {
    let k = useContext(reactContext)
    return k
  }

  function useContainerSetNew<
    Token extends ContainerKeys<getProviderFunction> & string,
    TokenMap extends { [T in ContainerKeys<getProviderFunction>]: T },
  >(
    cb: (keyMap: TokenMap) => Token[],
  ): ContainerSet<Token, getProviderFunction> {
    const root = useRoot()
    let tokenSet = root.getContainerSetCallback(cb)
    return useContainerSet(tokenSet)
  }

  function useContainerSet<
    Token extends ContainerKeys<getProviderFunction> & string,
  >(b: Token[]): ContainerSet<Token, getProviderFunction> {
    const [all, setAll] = useState<ContainerSet<Token, getProviderFunction>>(
      null as any,
    )
    const root = useRoot()

    useEffect(() => {
      root.getContainerSet(b).then((contSet) => {
        setAll(contSet)
      })
    }, b)

    useEffect(() => {
      const unsub = root.subscribeToContinerSet(b, (contSet) => {
        setAll(contSet)
      })
      return unsub
    }, b)

    return all
  }
  let m: AppContanier = 1 as any
  return {
    m,
    f,
    useRoot: useRoot,
    useContainerSet: useContainerSet,
    useContainerSetNew: useContainerSetNew,
    RootStoreContext2: RootStoreContext2,
  }
}

export const RootStoreContext2 = React.createContext<PizzaAppContainer>(
  {} as any,
)

function useRoot() {
  let k = useContext(RootStoreContext2)
  return k
}

let mega = getContainerSetHooks(getProviders, RootStoreContext2)
export const useContainerSet = mega.useContainerSet
export const useContainerSetNew = mega.useContainerSetNew
// export const useRoot = mega.useRoot
// let f = useRoot()
// export const useContainer = mega.useContainer

export function useContainer() {
  const root = useRoot()
  return useRootStores222(root.providerMap, root)
}

export function useRootStores222<
  T extends keyof ContMap,
  ContMap extends {
    [CK in T]: ContMap[CK]
  },
  /**
   * Basically a nice api for hooks
   * {
   *   name: () => [containerInstance, errr ]
   * }
   */
  ContainerGetter extends {
    [CK in T]: ContMap[CK] extends any
      ? [UnPromisify<ReturnType<ContMap[CK]>>, any, CK]
      : never
  },
>(
  providerMap: ContMap,
  //@ts-ignore
  root: RootContainer,
) {
  let root2 = useRoot()
  let FFF = <ContainerGetter>{}
  for (let contKey of root2.tokens) {
    Object.defineProperty(FFF, contKey, {
      get() {
        return useBetterGenericContainer(
          () =>
            // @ts-expect-error
            root2.containers[contKey],
          {
            subscribeFunction: (cb: () => any) =>
              root2.subscribeToContiner(contKey, cb),
            containerKey: contKey,
          },
        )
      },
      configurable: true,
    })
  }

  return FFF
}
