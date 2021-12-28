import React from "react"
import { observer } from "mobx-react-lite"
import cx from "classnames"
import {
  useKitchenContainer,
  usePizzaPlaceContainer,
} from "../stores/_container.hooks"
import s from "./Controls.module.css"

export const Controls = observer(() => {
  const { container } = usePizzaPlaceContainer()
  let kitchenContainer = useKitchenContainer()

  if (!container) return <>Pizza Place is loading</>
  if (!kitchenContainer.container) return <>Kitchen is loading</>
  const { kitchen } = kitchenContainer.container

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

      {diningTables.tables.map((table) => {
        let x = 12
        return (
          <div key={table.name}>
            table: {table.name}
            <button
              onClick={() => {
                kitchen.orderPizza(table)
              }}
            >
              order pizzas
            </button>
          </div>
        )
      })}
    </div>
  )
})
