import React, { useContext, useEffect, useState } from "react"
import { useNewDandy, useContainerSet } from "../containers/_container.hooks"
import type { Kitchen_Container } from "../containers/container.kitchen"
import type { PizzaPlace_Container } from "../containers/container.pizza-place"
import { observer } from "mobx-react-lite"

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

export const EnsureLol = observer(() => {
  let containerSet = useContainerSet(["aCont", "bCont"])
  console.log("lol")
  if (!containerSet) return <>Pizza Place is loading</>
  console.log("ready set", containerSet)
  return <>123</>
  // containerSet

  // return (
  //   <>
  //     <div className={cx(s.pizzaPlace, s.bricks)}>
  //       <h3>Pizza Place: {pizzaPlace.name}</h3>
  //       <h3>Open?: {pizzaPlace.isOpen ? "true" : "false"}</h3>
  //       <h3>Dining Tables: {diningTables.tables.length}</h3>
  //     </div>
  //   </>
  // )
})
