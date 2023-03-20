import React, { useContext, useEffect, useState } from "react"
import { useBetterGenericContainer } from "./library.hooks.js"
import { addGetter, UnPromisify } from "../_utils.js"
import type { Container, UnpackFunction, Prettify } from "iti"

type UnpackTokenFromContext<
  CK extends keyof Context,
  Context extends {},
> = UnPromisify<UnpackFunction<Context[CK]>>

type ContainerSet<Tokens extends keyof Context, Context extends {}> = {
  [S in Tokens]: UnpackTokenFromContext<S, Context>
}

export function getContainerSetHooks<
  Context extends object,
  DisposeContext extends object,
>(reactContext: React.Context<Container<Context, DisposeContext>>) {
  function useContainer() {
    const root = useContext(reactContext)
    return useRootStores(root)
  }

  function useRootStores<
    /**
     * Basically a nice api for hooks
     * {
     *   name: () => [containerInstance, err ]
     * }
     */
    ContainerGetter extends {
      [CK in keyof Context]: Context[CK] extends any
        ? [UnpackTokenFromContext<CK, Context> | undefined, any, CK]
        : never
    },
  >(appRoot: Container<Context, DisposeContext>): ContainerGetter {
    let FFF = <ContainerGetter>{}
    let tokens = appRoot.getTokens()

    for (let contKey in tokens) {
      addGetter(FFF, contKey, () =>
        useBetterGenericContainer(
          () => appRoot.containers[contKey as any],
          // @ts-expect-error
          (cb: () => any) => appRoot.subscribeToContainer(contKey, cb),
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
  ): [Prettify<ContainerSet<Tokens, Context>>, any] {
    const [all, setAll] = useState<ContainerSet<Tokens, Context>>(
      undefined as any,
    )
    const [err, setErr] = useState(undefined as any)
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
      const unsubscribe = root.subscribeToContainerSet(
        tokens,
        (err, contSet) => {
          if (err) {
            setErr(err)
            return
          }
          setAll(contSet)
        },
      )
      return unsubscribe
    }, tokens)

    return [all as any, err]
  }
  return {
    useContainer: useContainer,
    useContainerSet: useContainerSet,
  }
}
