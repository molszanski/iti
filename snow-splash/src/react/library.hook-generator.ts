import React, { useContext, useEffect, useState } from "react"
import { useBetterGenericContainer } from "./library.hooks"
import { addGetter, UnPromisify } from "../_utils"
import { NodeApi } from "../library.new-root-container"

type ContainerGetter<
  providerFun extends (...args: any) => any,
  token extends string,
> = UnPromisify<ReturnType<ReturnType<providerFun>[token]>>

type ContainerSet<
  Token extends string,
  providerFun extends (...args: any) => any,
> = {
  [S in Token]: ContainerGetter<providerFun, S>
}

export function getContainerSetHooks<
  getProviderFunction extends (...args) => { [k: string]: () => Promise<any> },
  Context extends object,
>(reactContext: React.Context<NodeApi<Context>>) {
  function useRoot() {
    let k = useContext(reactContext)
    return k
  }

  function useContainer() {
    const root = useRoot()
    return useRootStores(root)
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
  >(appRoot: NodeApi<Context>) {
    console.log("node app", appRoot.getTokens())
    console.log("node app", appRoot)
    // let root2 = useRoot()
    let FFF = <ContainerGetter>{}
    let tokens = appRoot.getTokens()
    console.log("herer")
    //@ts-ignore
    for (let contKey in tokens) {
      console.log("kkk", contKey)
      addGetter(FFF, contKey, () =>
        useBetterGenericContainer(
          () => appRoot.containers[contKey as any],
          //@ts-expect-error
          (cb: () => any) => appRoot.subscribeToContiner(contKey, cb),
          contKey,
        ),
      )
    }
    console.log("!@#!@#!@#!@")

    return FFF
  }

  function useContainerSet<
    Token extends keyof Context & string,
    TokenMap extends { [T in keyof Context]: T },
  >(
    tokensOrCallback: Token[] | ((keyMap: TokenMap) => Token[]),
  ): ContainerSet<Token, getProviderFunction> {
    const [all, setAll] = useState<ContainerSet<Token, getProviderFunction>>(
      undefined as any,
    )
    const root = useRoot()

    // const tokens =
    //   typeof tokensOrCallback === "function"
    //     ? root.getContainerSetCallback(tokensOrCallback)
    //     : tokensOrCallback

    let tokens = tokensOrCallback as any
    useEffect(() => {
      root.getContainerSet(tokens).then((contSet) => {
        setAll(contSet as any)
      })
    }, tokens)

    useEffect(() => {
      const unsub = root.subscribeToContinerSet(tokens, (contSet) => {
        setAll(contSet as any)
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
