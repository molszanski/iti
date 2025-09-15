import React, { act, createElement, useMemo, ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { attest } from "@ark/attest"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { ErrorAppWrapper, useItemSet } from "./mocks/Error.mock"
global.IS_REACT_ACT_ENVIRONMENT = true
let main_c
const h = createElement
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// ----------

describe("React hooks type tests", () => {
  let root: ReturnType<typeof createRoot>
  beforeEach(async () => {
    await act(async () => {
      main_c = document.createElement("div")
      document.body.appendChild(main_c)
      root = createRoot(main_c)
    })
  })
  afterEach(async () => {
    await act(async () => document.body.removeChild(main_c))
    main_c = null
  })

  it("should return error in an error context", async () => {
    function Test() {
      const [aItem, aItemErr] = useItemSet((c) => [c.name, c.two, c.three])
      if (aItemErr == null) return null
      expect(aItemErr).toBeDefined()
      expect(aItemErr).toBeInstanceOf(Error)
      return null
    }
    await act(async () => root.render(h(ErrorAppWrapper, {}, h(Test))))
  })
})
