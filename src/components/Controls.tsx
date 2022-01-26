import React, { useContext, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useContainerSet, useNewDandy } from "../containers/_container.hooks"
import { EnsureNewKitchenConainer, useNewKitchenContext } from "./EnsureKitchen"
import s from "./Controls.module.css"

export const Controls = observer(() => {
  return (
    <div className={s.controlsSections}>
      <PizzaPlaceControls />
      <EnsureNewKitchenConainer>
        <NewPizzaPlaceControls />
      </EnsureNewKitchenConainer>
      <StuffControls />
      <AdminControls />
      <AuthControls />
    </div>
  )
})

export const AdminControls = observer(() => {
  const [authCont] = useNewDandy().auth()
  const [showFatLib1, setShowFatLib1] = useState(false)
  if (!authCont) return <>AUTH is loading</>

  if (authCont.authroization.userType !== "admin") {
    return null
  }

  return (
    <div>
      <br />
      <button onClick={() => setShowFatLib1(true)}>downloads fatlib</button>
      {showFatLib1 && <FatLibData />}
    </div>
  )
})

export const FatLibData = observer(() => {
  const [fatlib] = useNewDandy().fatlib1()
  if (!fatlib) return <>fatlib is loading</>

  return <div>I can haz fat lib data 1: {fatlib.fatLibData}</div>
})

export const AuthControls = observer(() => {
  const [authCont] = useNewDandy().auth()

  if (!authCont) return <>AUTH is loading</>
  const { auth } = authCont

  return (
    <div>
      <button onClick={() => auth.changeUser("unauthenticated")}>
        Sign Out
      </button>
      <button onClick={() => auth.changeUser("manager")}>
        Sign in as Manager
      </button>
      <button onClick={() => auth.changeUser("admin")}>Sign in as Admin</button>
    </div>
  )
})

export const StuffControls = observer(() => {
  if (location.search === "") {
    location.href = location.href + "?priceMin=300"
  }

  return (
    <div>
      <button onClick={() => console.log("sdfsd")}>Stuff with URl</button>
    </div>
  )
})

export const NewPizzaPlaceControls = observer(() => {
  const {
    kitchen: { oven, kitchen },
    pizzaContainer,
  } = useNewKitchenContext()
  const { pizzaPlace } = pizzaContainer
  let f = useNewKitchenContext()

  return (
    <div>
      New Kitchen controls <br />
      Kitchen name: {kitchen.kitchenName} <br />
      Oven size: {oven.pizzaCapacity} <br />
      <button onClick={() => pizzaPlace.openPizzaPlace()}>
        Open Restaurant
      </button>
      <button onClick={() => pizzaPlace.closePizzaPlace()}>
        Close Pizza Place
      </button>
    </div>
  )
})

type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T
  ? 1
  : 2) extends <G>() => G extends U ? 1 : 2
  ? Y
  : N

declare const exactType: <T, U>(
  draft: T & IfEquals<T, U>,
  expected: U & IfEquals<T, U>,
) => IfEquals<T, U>

let a = 1
let b = 123

// $ExpectError
exactType(typeof a, typeof b)
export const PizzaPlaceControls = observer(() => {
  const [kitchenCont] = useNewDandy().kitchen()
  const [pizzaPlaceCont] = useNewDandy().pizzaContainer()
  const [kitchenManipulatorCont] = useNewDandy().kitchenManipulator()
  const [authCont] = useNewDandy().auth()
  const x = useContainerSet(["auth"])

  if (!pizzaPlaceCont) return <>Pizza Place is loading</>
  if (!kitchenCont) return <>Kitchen is loading</>
  if (!kitchenManipulatorCont) return <>Kitchen is loading</>
  if (!authCont) return <>AUTH is loading</>
  if (!x) return <>AUTH is loading</>

  const { orderManager } = kitchenCont
  const { pizzaPlace, diningTables } = pizzaPlaceCont
  const { auth, authroization } = x.auth

  const actions = authroization.getAvaliableActions()[authroization.userType]

  return (
    <div>
      {actions.addTables && (
        <button onClick={() => diningTables.addNewTable()}>Add Table</button>
      )}

      <button onClick={() => pizzaPlace.openPizzaPlace()}>
        Open Restaurant
      </button>
      <button onClick={() => pizzaPlace.closePizzaPlace()}>
        Close Pizza Place
      </button>

      <br />
      {actions.upgradeKitchen && (
        <button
          onClick={() =>
            kitchenManipulatorCont.kitchenSizeController.increaseKitchenSize()
          }
        >
          Increase Kitchen Size
        </button>
      )}

      <br />
      <button onClick={() => pizzaPlace.getFatLibImage()}>
        Get important stuff from fat lib 2
      </button>

      {diningTables.tables.map((table) => {
        return (
          <div key={table.name}>
            table: {table.name}
            {actions.orderPizza && (
              <button
                onClick={() => {
                  orderManager.orderPizza(table)
                }}
              >
                order pizzas
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
})
