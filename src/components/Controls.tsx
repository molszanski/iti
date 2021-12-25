import React from "react"
import cx from "classnames"
import { usePizzaPlaceContainer } from "../stores/container.pizza-place.hook"
import s from "./Controls.module.css"

export const Controls = () => {
  const { container } = usePizzaPlaceContainer()
  if (!container) return <>Pizza Place is loading</>

  const { pizzaPlace, diningTables } = container
  return (
    <div>
      <button onClick={() => diningTables.addNewTable()}>Add Table</button>

      <button onClick={() => pizzaPlace.openPizzaPlace()}>
        Open Restaurant
      </button>
      <button onClick={() => pizzaPlace.closePizzaPlace()}>
        Close Pizza Place
      </button>
    </div>
  )
}
