import React, { useState } from "react"
import { observer, useStaticRendering } from "mobx-react-lite"
import cx from "classnames"
import s from "./PizzaPlace.module.css"
import { usePizzaPlaceContainer } from "../stores/container.pizza-place.hook"

export const PizzaPlace = observer(() => {
  const [a, setA] = useState(0)
  const { container } = usePizzaPlaceContainer()
  if (!container) {
    console.log("dupa")
    return <>Pizza Place is loading</>
  }
  //@ts-ignore
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
      </div>
    </>
  )
})
