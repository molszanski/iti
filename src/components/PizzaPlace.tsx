import React, { useState } from "react"
import { observer, useStaticRendering } from "mobx-react-lite"
import cx from "classnames"
import s from "./PizzaPlace.module.css"
import {
  useKitchenContainer,
  usePizzaPlaceContainer,
} from "../containers/_container.hooks"

export const PizzaPlace = observer(() => {
  const [a, setA] = useState(0)
  const { container } = usePizzaPlaceContainer()

  if (!container) {
    return <>Pizza Place is loading</>
  }

  const { pizzaPlace, diningTables } = container
  console.log("pizzaPlace.isOpen", pizzaPlace.isOpen)
  return (
    <>
      <div className={cx(s.pizzaPlace, s.bricks)}>
        <h3>Pizza Place: {pizzaPlace.name}</h3>
        <h3>Open?: {pizzaPlace.isOpen ? "true" : "false"}</h3>
        <h3>Dining Tables: {diningTables.tables.length}</h3>
        <h4>Aa val: {a}</h4>
        <button onClick={() => setA(a + 1)}>Update a</button>

        <KitchenData />
      </div>
    </>
  )
})

export const KitchenData = observer(() => {
  const { container } = useKitchenContainer()
  if (!container) {
    return <>Kitchen is loading</>
  }

  //@ts-ignore
  const { kitchen, orderManager } = container
  return (
    <>
      <h3>Kitchen data: ({kitchen.kitchenName})</h3>
      <h4>Orders:</h4>
      <ul>
        {orderManager.orders.map((order, idx) => {
          return (
            <li key={idx}>
              table: {order.table.name} | pizzastate: {order.pizza.state}
              <ul>
                {order.pizza.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient.name}</li>
                ))}
              </ul>
            </li>
          )
        })}

        <h4>Ingredients:</h4>
        <Inventory />
      </ul>
    </>
  )
})

export const Inventory = observer(() => {
  const { container } = useKitchenContainer()
  if (!container) {
    return <>Pizza Place is loading</>
  }
  const { ingredients } = container
  return (
    <ul>
      {ingredients.ingredients.map((ingredient, idx) => {
        return <li key={idx}>{ingredient.name}</li>
      })}
    </ul>
  )
})
