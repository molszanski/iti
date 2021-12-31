import React from "react"
import { observer } from "mobx-react-lite"
import cx from "classnames"
import {
  useKitchenContainer,
  usePizzaPlaceContainer,
} from "../containers/_container.hooks"
import s from "./Controls.module.css"

export const Controls = observer(() => {
  return (
    <div className={s.controlsSections}>
      <PizzaPlaceControls />
      <StuffControls />
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

export const PizzaPlaceControls = observer(() => {
  const { container } = usePizzaPlaceContainer()
  let kitchenContainer = useKitchenContainer()

  if (!container) return <>Pizza Place is loading</>
  if (!kitchenContainer.container) return <>Kitchen is loading</>
  const { kitchen, orderManager, kitchenSizeController } =
    kitchenContainer.container

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

      <button onClick={() => kitchenSizeController.increaseKitchenSize()}>
        Increase Kitchen Size
      </button>

      {diningTables.tables.map((table) => {
        return (
          <div key={table.name}>
            table: {table.name}
            <button
              onClick={() => {
                orderManager.orderPizza(table)
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
