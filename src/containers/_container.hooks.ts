import _ from "lodash"
import React, { useContext, useEffect, useState } from "react"
import { useRootStores } from "../_library/library.hooks"
import { RootContainer } from "../_library/library.root-container"
import {
  getMainPizzaAppContainer,
  PizzaAppContainer,
  getProviders,
} from "./_root.store"

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

let x: PizzaAppContainer = null as any
type s = PizzaAppContainer["providerMap"]

export function useNewDandy33333() {
  const root = useRoot2()

  return useRootStores(root.providerMap, root)
}
export type ValuesOf<T extends readonly any[]> = T[number]
// export function useNewDandySet<
//   ContMap extends ReturnType<typeof useRoot2>["providerMap"],
//   KKK extends keyof ContMap,
//   // ContMap extends {
//   //   [CK in KKK]: ContMap[CK]
// >(tokens: KKK[]) {
//   const root = useRoot2()
//   let x: ContMap = null as any
//   let f: KKK = null as any

//   let [containerSet, err] = useRootStores222(root.providerMap, root, [
//     "auth",
//     "bCont",
//   ])

//   return [containerSet, err]
// }

// let [a, b] = useNewDandySet(["aCont", "auth"])

type UnPromisify<T> = T extends Promise<infer U> ? U : T

export function useShit<
  Token extends keyof ReturnType<typeof getProviders>,
  cSet = {
    [S in Token]: UnPromisify<ReturnType<ReturnType<typeof getProviders>[S]>>
  },
>(b: Token[]): cSet {
  // type cSet = {
  //   [S in Token]: UnPromisify<ReturnType<ReturnType<typeof getProviders>[S]>>
  // }
  const [all, setAll] = useState<cSet>(null as any)
  const root = useRoot2()

  useEffect(() => {
    root.getContainerSet(b).then((contSet) => {
      console.log("aaa", contSet)
      //@ts-ignore
      setAll(contSet)
    })
  }, b)

  return all
}
