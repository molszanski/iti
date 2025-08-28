import React, { useContext, useEffect, useState } from "react"
import { useBetterGenericContainer } from "./library.hooks.js"
import { addGetter } from "../_utils.js"

import type { UnPromisify } from "../_utils"
import type { Container, UnpackFunction, Prettify } from "iti"

type UnpackTokenFromContext<
  CK extends keyof Context,
  Context extends {},
> = UnPromisify<UnpackFunction<Context[CK]>>

type ContainerSet<Tokens extends keyof Context, Context extends {}> = {
  [S in Tokens]: UnpackTokenFromContext<S, Context>
}

export function getItemSetHooks<
  Context extends object,
  DisposeContext extends object,
>(reactContext: React.Context<Container<Context, DisposeContext>>) {
  function useItem() {
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
          () => appRoot.items[contKey as any],
          // @ts-expect-error
          (cb: () => any) => appRoot.subscribeToItem(contKey, cb),
          contKey,
        ),
      )
    }

    return FFF
  }

  function useItemSet<
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
      root
        .getItemSet(tokens)
        .then((contSet) => {
          setAll(contSet)
        })
        .catch((err) => {
          setErr(err)
        })
    }, tokens)

    useEffect(() => {
      const unsubscribe = root.subscribeToItemSet(tokens, (err, contSet) => {
        if (err) {
          setErr(err)
          return
        }
        setAll(contSet)
      })
      return unsubscribe
    }, tokens)

    /**
     * This is an import SYNC fallback mode to enable hassle free SSR
     *
     * We must provide proper values at once from iti cache to make ssr work
     *
     * Sadly it has a second instant rerender in react, but I would need
     * to hack into react internals to prevent it
     */
    try {
      const itemSet = root.getItemSetSync(tokens)
      if (!(itemSet instanceof Promise)) {
        return [itemSet as any, err]
      }
    } catch (err) {
      setErr(err)
    }

    return [all as any, err]
  }
  return {
    useItem: useItem,
    useItemSet: useItemSet,

    /**
     *  @deprecated Use useItem and useItemSet instead
     */
    useContainer: useItem,
    /**
     *  @deprecated Use useItem and useItemSet instead
     */
    useContainerSet: useItemSet,
  }
}
