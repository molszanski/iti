import React from "react"
import { useAContainer } from "./stores/_container.hooks"

export const Main = () => {
  return (
    <div>
      Main Component: <Profile />
    </div>
  )
}

export const Profile = () => {
  const { container } = useAContainer()
  console.log("rendering profile with a Container", container)
  if (!container) return null
  const { a1, a2 } = container

  return (
    <>
      <span>{a1.getName()}</span>
    </>
  )
}
