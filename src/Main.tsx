import React from "react"
import cx from "classnames"
import { useDandy } from "./containers/_container.hooks"
import { PizzaPlace } from "./components/PizzaPlace"
import s from "./Main.module.css"
import { MainLayoutControl } from "./components/MainLayoutControl"

export const Main = () => {
  return (
    <div>
      Main Component: <Profile />
    </div>
  )
}

export const Profile = () => {
  const [a] = useDandy().aCont()
  if (!a) return null
  const { a1, a2 } = a

  return (
    <>
      <span>{a1.getName()}</span>

      <MainLayoutControl />
    </>
  )
}
