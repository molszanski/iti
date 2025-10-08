import React, { act, createElement } from "react"
import { createRoot } from "react-dom/client"
import { attest } from "@ark/attest"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { useMockAppItem, useMockAppItemSet } from "./mocks/_mock-app-hooks"
import type { A_Container } from "./mocks/container.a"
import type { B_Container } from "./mocks/container.b"
import type { C_Container } from "./mocks/container.c"
import { MockAppWrapper } from "./mocks/_mock-app-components"
global.IS_REACT_ACT_ENVIRONMENT = true
let main_c
const h = createElement

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

  it("base", async () => {
    function Test() {
      const xx = useMockAppItem()
      expect(xx.aCont).toBeDefined()
      return null
    }
    await act(async () => root.render(h(MockAppWrapper, {}, h(Test))))
  })

  it("test lol", async () => {
    function Test() {
      const [aItem, aItemErr] = useMockAppItem().aCont
      if (aItem == null) return null

      expect(aItemErr).toBeUndefined()
      attest<A_Container>(aItem)
      expect(aItem.a1.b).toBe(12)
      return null
    }
    await act(async () => root.render(h(MockAppWrapper, {}, h(Test))))
  })

  it("useMockAppItemSet should return valid result", async () => {
    function Test() {
      const [itemSet, isError] = useMockAppItemSet(["aCont", "bCont"])
      if (!itemSet) return null

      const { aCont, bCont } = itemSet
      attest<A_Container>(aCont)
      attest<B_Container>(bCont)

      expect(aCont.a1).toBeDefined()
      expect(aCont.a1.b).toBe(12)

      expect(isError).toBeUndefined()

      return null
    }
    await act(async () => root.render(h(MockAppWrapper, {}, h(Test))))
    attest.instantiations([4087, "instantiations"])
  })

  it("useMockAppItemSet via CB should return valid result", async () => {
    function Test() {
      const [itemSet, isError] = useMockAppItemSet((c) => [c.aCont, c.bCont])
      if (!itemSet) return null

      const { aCont, bCont } = itemSet
      attest<A_Container>(aCont)
      attest<B_Container>(bCont)

      expect(aCont.a1).toBeDefined()
      expect(aCont.a1.b).toBe(12)

      expect(isError).toBeUndefined()

      return null
    }
    await act(async () => root.render(h(MockAppWrapper, {}, h(Test))))
    attest.instantiations([4087, "instantiations"])
  })

  it("useMockAppItemSet should not return unrequested values via CB should return valid result", async () => {
    function Test() {
      const [itemSet, isError] = useMockAppItemSet((c) => [c.aCont])
      if (!itemSet) return null

      attest<A_Container>(itemSet.aCont)
      // @ts-expect-error
      attest(() => itemSet.bCont).type.errors(
        "Property 'bCont' does not exist on type",
      )

      // @ts-expect-error
      expect(itemSet.bCont).toBeUndefined()

      return null
    }
    await act(async () => root.render(h(MockAppWrapper, {}, h(Test))))
    attest.instantiations([4087, "instantiations"])
  })

  it("useItemSet should work in SYNC mode and provide itemSet value on first render if it was called before", async () => {
    let firstTestFirstRender = true
    function Test() {
      const [itemSet, isError] = useMockAppItemSet((c) => [c.aCont, c.bCont])
      if (firstTestFirstRender) {
        firstTestFirstRender = false
        expect(itemSet).toBeUndefined()
      } else {
        expect(itemSet).toBeDefined()
      }
      if (!itemSet) return null
      return null
    }
    await act(async () => root.render(h(MockAppWrapper, {}, h(Test))))

    function Test2() {
      const [itemSet, isError] = useMockAppItemSet((c) => [c.aCont, c.bCont])
      expect(itemSet).toBeDefined()

      const { aCont, bCont } = itemSet

      attest<A_Container>(aCont)
      attest<B_Container>(bCont)

      expect(aCont.a1).toBeDefined()
      expect(aCont.a1.b).toBe(12)

      expect(isError).toBeUndefined()
      return null
    }
    await act(async () => root.render(h(MockAppWrapper, {}, h(Test2))))
    // attest.instantiations([4087, "instantiations"])
  })
})
