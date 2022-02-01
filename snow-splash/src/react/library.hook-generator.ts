import React, { useContext, useEffect, useState } from "react"
import { useBetterGenericContainer } from "./library.hooks"
import { addGetter, UnPromisify } from "../_utils"

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

export function getContainerSetHooks<
  getProviderFunction extends (...args) => { [k: string]: () => Promise<any> },
  AppContanier extends getAppRootContainer<getProviderFunction>,
>(
  getProviders: getProviderFunction,
  reactContext: React.Context<AppContanier>,
) {
  const f: ContainerKeys<getProviderFunction> = undefined as any

  function useRoot() {
    let k = useContext(reactContext)
    return k
  }

  function useContainer() {
    const root = useRoot()
    return useRootStores(root.providerMap, root)
  }

  function useRootStores<
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
        ? [UnPromisify<ReturnType<ContMap[CK]>> | undefined, any, CK]
        : never
    },
  >(
    providerMap: ContMap,
    //@ts-ignore
    appRoot: RootContainer,
  ) {
    // let root2 = useRoot()
    let FFF = <ContainerGetter>{}
    for (let contKey of appRoot.tokens) {
      addGetter(FFF, contKey, () =>
        useBetterGenericContainer(
          () => appRoot.containers[contKey],
          //@ts-expect-error
          (cb: () => any) => appRoot.subscribeToContiner(contKey, cb),
          contKey,
        ),
      )
    }

    return FFF
  }

  function useContainerSet<
    Token extends ContainerKeys<getProviderFunction> & string,
    TokenMap extends { [T in ContainerKeys<getProviderFunction>]: T },
  >(
    tokensOrCallback: Token[] | ((keyMap: TokenMap) => Token[]),
  ): ContainerSet<Token, getProviderFunction> {
    const [all, setAll] = useState<ContainerSet<Token, getProviderFunction>>(
      undefined as any,
    )
    const root = useRoot()

    const tokens =
      typeof tokensOrCallback === "function"
        ? root.getContainerSetCallback(tokensOrCallback)
        : tokensOrCallback

    useEffect(() => {
      root.getContainerSet(tokens).then((contSet) => {
        setAll(contSet)
      })
    }, tokens)

    useEffect(() => {
      const unsub = root.subscribeToContinerSet(tokens, (contSet) => {
        setAll(contSet)
      })
      return unsub
    }, tokens)

    return all
  }
  return {
    useRoot: useRoot,
    useContainer: useContainer,
    useContainerSet: useContainerSet,
    useRootContainerMap: useRootStores,
  }
}
