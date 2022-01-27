import React from "react"
import { render, screen } from "@testing-library/react"

import { expectType, expectError } from "tsd"
import type { AuthContainer } from "./container.auth"
import { useContainer } from "./_container.hooks"
import { PizzaAppWrapper } from "./_AppRoot"
import { B_Container } from "./container.b"

// it("should pass basic ts test", () => {
//   let [authCont] = useContainer().auth
//   expectType<AuthContainer>(authCont)
// })

const App = () => <>learn react</>
// https://github.com/SamVerschueren/tsd
test("renders learn react link", () => {
  render(<App />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})

it("should pass basic ts test", () => {
  const App = () => {
    let [authCont] = useContainer().auth
    expectType<AuthContainer>(authCont)

    let x = useContainer()
    expectError<any>(x)

    return <></>
  }
  render(
    <PizzaAppWrapper>
      <App />
    </PizzaAppWrapper>,
  )
})
