import React from "react"
import { useContainer } from "./stores/_container.hooks"

// export async function provideAuthContainer() {
//   return {
//     uniqueID: "authContainerUniString",
//     auth: new Auth(),
//   }
// }

export const Profile = () => {
  const { container } = useContainer("authContainerUniString")
  if (!container) return null
  const { a1, a2 } = container

  return (
    <>
      <span>{a1.getName()}</span>
    </>
  )
}
