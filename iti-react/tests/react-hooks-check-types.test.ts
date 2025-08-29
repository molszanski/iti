import React, { useEffect, act, useMemo, createElement } from "react"
import { createRoot } from "react-dom/client"
import { useState } from "react"
import { attest } from "@ark/attest"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  useMockAppItem,
  useMockAppItemSet,
  MyRootCont,
} from "./mocks/_mock-app-hooks"
import type { A_Container } from "./mocks/container.a"
import type { B_Container } from "./mocks/container.b"
import type { C_Container } from "./mocks/container.c"
import { MockAppWrapper, Lol } from "./mocks/_mock-app-components"
import { getMainMockAppContainer } from "./mocks/_mock-app-container.ts"

function useToggle(initialState = false) {
  const [state, setState] = useState(initialState)
  return [
    state,
    (newState?: boolean) => {
      if (typeof newState === "boolean") {
        setState(newState)
      } else {
        setState(!state)
      }
    },
  ] as const
}

// it("should toggle state", () => {
//   const { result } = renderHook(() => useToggle())
//   act(() => {
//     console.log("dupa", result.current[0])
//   })
//   console.log("~~~~>", result.current[0])
//   expect(1).toBe(1)
// })

// describe("useToggle hook", () => {
//   it("should start with false state", () => {
//     const { result } = renderHook(() => useToggle())
//     expect(result.current[0]).toBe(false)
//   })

//   it("should toggle state from false to true", () => {
//     const { result } = renderHook(() => useToggle())
//     const toggle = result.current[1]

//     expect(result.current[0]).toBe(false)
//     act(() => toggle())
//     expect(result.current[0]).toBe(true)
//   })

//   // it("should toggle state back and forth", () => {
//   //   const { result } = renderHook(() => useToggle())

//   //   // Initial state should be false
//   //   expect(result.current[0]).toBe(false)

//   //   // Toggle to true
//   //   act(() => {
//   //     result.current[1]()
//   //   })
//   //   expect(result.current[0]).toBe(true)

//   //   // Toggle back to false
//   //   act(() => {
//   //     result.current[1]()
//   //   })
//   //   expect(result.current[0]).toBe(false)

//   //   // Toggle to true again
//   //   act(() => {
//   //     result.current[1]()
//   //   })
//   //   expect(result.current[0]).toBe(true)
//   // })

//   // it("should accept initial state", () => {
//   //   const { result } = renderHook(() => useToggle(true))
//   //   expect(result.current[0]).toBe(true)
//   // })

//   // it("should set toggle to specific state - true", () => {
//   //   const { result } = renderHook(() => useToggle(false))

//   //   // Start with false
//   //   expect(result.current[0]).toBe(false)

//   //   // Set to true explicitly
//   //   act(() => {
//   //     result.current[1](true)
//   //   })
//   //   expect(result.current[0]).toBe(true)

//   //   // Set to true again (should remain true)
//   //   act(() => {
//   //     result.current[1](true)
//   //   })
//   //   expect(result.current[0]).toBe(true)
//   // })

//   // it("should set toggle to specific state - false", () => {
//   //   const { result } = renderHook(() => useToggle(true))

//   //   // Start with true
//   //   expect(result.current[0]).toBe(true)

//   //   // Set to false explicitly
//   //   act(() => {
//   //     result.current[1](false)
//   //   })
//   //   expect(result.current[0]).toBe(false)

//   //   // Set to false again (should remain false)
//   //   act(() => {
//   //     result.current[1](false)
//   //   })
//   //   expect(result.current[0]).toBe(false)
//   // })

//   // it("should mix toggle and explicit state setting", () => {
//   //   const { result } = renderHook(() => useToggle())

//   //   // Start with false
//   //   expect(result.current[0]).toBe(false)

//   //   // Toggle to true
//   //   act(() => {
//   //     result.current[1]()
//   //   })
//   //   expect(result.current[0]).toBe(true)

//   //   // Set to false explicitly
//   //   act(() => {
//   //     result.current[1](false)
//   //   })
//   //   expect(result.current[0]).toBe(false)

//   //   // Set to true explicitly
//   //   act(() => {
//   //     result.current[1](true)
//   //   })
//   //   expect(result.current[0]).toBe(true)

//   //   // Toggle (should go to false)
//   //   act(() => {
//   //     result.current[1]()
//   //   })
//   //   expect(result.current[0]).toBe(false)
//   // })
// })
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

  // it("useMockAppItemSet should return exact types", () => {
  //   const [containerSet, containerSetErr] = useMockAppItemSet([
  //     "aCont",
  //     "bCont",
  //   ])
  //   const [containerSet2, containerSetErr2] = useMockAppItemSet((c) => [
  //     c.aCont,
  //     c.bCont,
  //   ])
  //   if (containerSet != null) {
  //     attest<A_Container>(containerSet.aCont)
  //     // @ts-expect-error
  // attest(() => containerSet.cCont).type.errors(
  //   "Property 'cCont' does not exist on type",
  // )
  //   }
  //   if (containerSet2 != null) {
  //     attest<B_Container>(containerSet2.bCont)
  //     // @ts-expect-error
  //     attest(() => containerSet2.cCont).type.errors(
  //       "Property 'cCont' does not exist on type",
  //     )
  //   }
  //   attest.instantiations([1800, "instantiations"])
  // })
})
