import React from "react"
import { useNewDandy } from "./containers/_container.hooks"
import { MainLayoutControl } from "./components/MainLayoutControl"

export const Main = () => {
  return (
    <div>
      Main Component: <Profile />
    </div>
  )
}

export const Profile = () => {
  const [a] = useNewDandy().aCont()
  if (!a) return null
  const { a1, a2 } = a

  return (
    <>
      <span>{a1.getName()}</span>
      <MainLayoutControl />
    </>
  )
}
