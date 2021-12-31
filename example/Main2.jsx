import React from "react"
import { useAContainer, useAuthContainer } from "./stores/_container.hooks"

export const ProfileAlt = () =>
  useAuthContainer((z) =>
    useAContainer(({ a1 }) => {
      console.log("rendering profile with a Container", a1, auth)
      return (
        <>
          <span>{a1.getName()}</span>
        </>
      )
    }),
  )
