import type { NodeApi, UnpackFunction } from "snow-splash"
import React, { useContext, useEffect, useState } from "react"
import { useBetterGenericContainer } from "./library.hooks"
import { addGetter, UnPromisify } from "../_utils"

type UnpackTokenFromContext<
  CK extends keyof Context,
  Context extends {},
> = UnPromisify<UnpackFunction<Context[CK]>>

type ContainerSet<Tokens extends keyof Context, Context extends {}> = {
  [S in Tokens]: UnpackTokenFromContext<S, Context>
}

export function getContainerSetHooks<Context extends object>(
  reactContext: React.Context<NodeApi<Context>>,
) {
  function useContainer() {
    const root = useContext(reactContext)
    return useRootStores(root)
  }

  function useRootStores<
    /**
     * Basically a nice api for hooks
     * {
     *   name: () => [containerInstance, errr ]
     * }
     */
    ContainerGetter extends {
      [CK in keyof Context]: Context[CK] extends any
        ? [UnpackTokenFromContext<CK, Context> | undefined, any, CK]
        : never
    },
  >(appRoot: NodeApi<Context>): ContainerGetter {
    let FFF = <ContainerGetter>{}
    let tokens = appRoot.getTokens()

    for (let contKey in tokens) {
      addGetter(FFF, contKey, () =>
        useBetterGenericContainer(
          () => appRoot.containers[contKey as any],
          //@ts-expect-error
          (cb: () => any) => appRoot.subscribeToContiner(contKey, cb),
          contKey,
        ),
      )
    }

    return FFF
  }

  function useContainerSet<
    Tokens extends keyof Context,
    TokenMap extends { [T in keyof Context]: T },
  >(
    tokensOrCallback: Tokens[] | ((keyMap: TokenMap) => Tokens[]),
  ): ContainerSet<Tokens, Context> {
    const [all, setAll] = useState<ContainerSet<Tokens, Context>>(
      undefined as any,
    )
    const root = useContext(reactContext)

    // WIP
    const tokens =
      typeof tokensOrCallback === "function"
        ? root._extractTokens(tokensOrCallback as any)
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
    useContainer: useContainer,
    useContainerSet: useContainerSet,
  }
}
