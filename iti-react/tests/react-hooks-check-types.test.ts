import React, { useEffect, act, useMemo } from "react"
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
let container

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

describe("React hooks type tests", () => {
  it("initializes and increments state", async () => {
    let hookResult

    // Wrapper to capture hook output
    function TestComponent({ initial }) {
      hookResult = useToggle(initial) // Assign to outer scope for assertions
      return null // No need to render anything
    }

    await act(async () => {
      createRoot(container).render(React.createElement(TestComponent))
    })

    expect(hookResult[0]).toBe(false) // Initial state

    act(() => {
      hookResult[1]() // Trigger update
    })

    expect(hookResult[0]).toBe(true) // Updated state
  })

  it("test lol", async () => {
    let hookResult
    let store

    // Wrapper to capture hook output
    function TestComponent2() {
      // hookResult = useToggle(initial) // Assign to outer scope for assertions

      store = useMemo(() => getMainMockAppContainer(), [])
      return null

      // return <MyRootCont.Provider value={store}>{children}</MyRootCont.Provider>
      // return null // No need to render anything
    }

    await act(async () => {
      createRoot(container).render(React.createElement(TestComponent2))
    })
    await act(async () => {
      const [aContainer] = useMockAppItem().aCont
      console.log("~~~aContainer", aContainer)
    })
    console.log("container", store)
  })

  //   it("render dupa", () => {
  //     // render(<MockAppWrapper></MockAppWrapper>)
  //     render("fun-fun" as any, { wrapper: Lol })
  //     const x = screen.getByTestId("lol")
  //     console.log("x", x)
  //     expect(x).toHaveTextContent("fun-fun")
  //   })
  // beforeEach(() => {
  //   render(MockAppWrapper)
  // })
  // it("useMockAppItem should not return `any` type", () => {
  //   const { result } = renderHook(() => useMockAppItem())
  //   render("fun-fun" as any, { wrapper: MockAppWrapper })
  //   const items = result.current
  //   // Ensure containers is not of type `any` by checking it has specific structure
  //   attest(items).type.toString.snap()
  //   attest.instantiations([1000, "instantiations"])
  // })
  // it("useMockAppItem should test if useMockAppItem gets correct types", () => {
  //   const [aContainer] = useMockAppItem().aCont
  //   attest<undefined | A_Container>(aContainer)
  //   if (aContainer != null) {
  //     attest<A_Container>(aContainer)
  //   }
  //   attest.instantiations([1200, "instantiations"])
  // })
  // it("useMockAppItemSet should not return any", () => {
  //   const containerSet = useMockAppItemSet(["aCont", "bCont"])
  //   // Ensure containerSet is not of type `any` by checking it has specific structure
  //   attest(containerSet).type.toString.snap()
  //   attest.instantiations([1400, "instantiations"])
  // })
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
  //     attest(() => containerSet.cCont).type.errors(
  //       "Property 'cCont' does not exist on type",
  //     )
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
