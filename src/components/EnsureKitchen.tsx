import React, { useContext, useEffect, useState } from "react"
import { useNewDandy } from "../containers/_container.hooks"
import type { Kitchen_Container } from "../containers/container.kitchen"
import type { PizzaPlace_Container } from "../containers/container.pizza-place"
import type {
  getMainPizzaAppContainer,
  PizzaAppContainer,
} from "../containers/_root.store"
import { useRootStores } from "../_library/library.hooks"

export interface EnsureKitchenContext {
  kitchenCont: Kitchen_Container
  pizzaPlaceCont: PizzaPlace_Container
}
export const EnsureKitchenReactContext =
  React.createContext<EnsureKitchenContext>({} as any)

export function useKitchenContext() {
  return useContext(EnsureKitchenReactContext)
}

interface MyProps {
  children: React.ReactNode
}
export const EnsureKitchenConainer = (props: MyProps) => {
  const [all, setAll] = useState<EnsureKitchenContext>({} as any)

  const [kitchenCont] = useNewDandy().kitchen()
  const [pizzaPlaceCont] = useNewDandy().pizzaContainer()
  const [kitchenManipulatorCont] = useNewDandy().kitchenManipulator()
  const [authCont] = useNewDandy().auth()

  useEffect(() => {
    setAll({
      kitchenCont: kitchenCont,
      pizzaPlaceCont: pizzaPlaceCont,
    })
  }, [kitchenCont, pizzaPlaceCont])

  if (
    !all.pizzaPlaceCont ||
    !all.kitchenCont ||
    !kitchenManipulatorCont ||
    !authCont
  ) {
    return <>Kitchen is loading</>
  }

  return (
    <EnsureKitchenReactContext.Provider value={all}>
      {props.children}
    </EnsureKitchenReactContext.Provider>
  )
}

const useFancy = (p: ContainerKeys) => {
  console.log("use fancy start")
  const lol = {
    kitchen: 12,
    pizza: 13,
    isReady: false,
  }
  console.log("use fancy end")
  return lol
}

export const EnsureLol = () => {
  const [all, setAll] = useState(null as any)
  console.log("ensure start")
  // const { kitchen } = useFancy()
  const containers = useFancy(["kitchen", "fatlib1"])
  console.log("ensure end")

  return <>"happy"</>
  // let x = [
  //   useNewDandy().kitchen(),
  //   useNewDandy().pizzaContainer(),
  //   useNewDandy().kitchenManipulator(),
  //   useNewDandy().auth(),
  // ]
  // console.log(x)
  // const outs = x.map((p) => p[0])
  // useEffect(() => {
  //   Promise.all(outs).then(() => {
  //     console.log("loaded")
  //     setAll({
  //       kitchen: outs[0],
  //       pizzaPlaceCont: outs[1],
  //     })
  //   })
  // }, outs)

  // console.log("££££", all)

  // if (all == null) {
  //   return <>Kitchen is loading</>
  // }

  // return <>name: {all.pizzaPlaceCont.pizzaPlace.name}</>
}

export const RootStoreContext3 = React.createContext<
  ReturnType<typeof getMainPizzaAppContainer>
>({} as any)
function useRoot2() {
  let k = useContext(RootStoreContext3)
  return k
}

export function useNewDandy2() {
  const root = useRoot2()
  return useRootStores(root.providerMap, root)
}

type MainLol = ReturnType<typeof getMainPizzaAppContainer>

type ContainerMap = ReturnType<typeof useNewDandy2>
type ContainerKeys = Array<keyof ContainerMap>
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
export function useLol() {
  const [all, setAll] = useState({} as any)
  let d = useNewDandy2()
  type Dandy = ReturnType<typeof useNewDandy2>

  const keyz: ContainerKeys = ["auth", "bCont"]
  // let containerMap: {
  //   [K in keyof Dandy]: ReturnType<Dandy[K]>[0]
  // } = {} as any

  useEffect(() => {}, keyz)

  console.log("sdfs", keyz)

  let m: Dandy = {} as any
}
