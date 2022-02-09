import React from "react"
import s from "./MainLayoutControl.module.css"
import { PizzaPlace } from "./PizzaPlace"
import { Controls } from "./Controls"

export const MainLayoutControl = () => {
  return (
    <>
      <div className={s.controls}>
        <div className={s.main}>
          <PizzaPlace />
        </div>
        <div className={s.aside}>
          <Controls />
        </div>
        <div className={s.bottom}>
          <h3>Pizza Place1</h3>
        </div>
      </div>
    </>
  )
}
