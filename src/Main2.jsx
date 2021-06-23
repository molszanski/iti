import React from "react"
import { useAContainer } from "./stores/_container.hooks"

export const ProfileAlt = () =>
  useAContainer(({ a1 }) => {
    console.log("rendering profile with a Container", container)

    return (
      <>
        <span>{a1.getName()}</span>
      </>
    )
  })
