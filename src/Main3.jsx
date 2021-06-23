import React from "react"
import { useAContainer, useAuthContainer } from "./stores/_container.hooks"

// 3: Something like redux connect
// https://react-redux.js.org/using-react-redux/usage-with-typescript#inferring-the-connected-props-automatically
export const ProfileAlt = connectAuthContainer((props) => {
  console.log("rendering profile with a Container", props.a1, props.auth)

  return (
    <>
      <span>{propsa1.getName()}</span>
    </>
  )
})

// 3A: Connect with Container symbols
export async function provideAuthContainer() {
  return {
    uniqueID: "authContainerUniString",
    auth: new Auth(),
  }
}

export const ProfileAlt = connectContainer(
  ["authContainerUniString"],
  (props) => {
    console.log("rendering profile with a Container", props.a1, props.auth)

    return (
      <>
        <span>{propsa1.getName()}</span>
      </>
    )
  },
)
