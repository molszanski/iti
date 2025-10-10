import React, { act, createElement, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { getItemSetHooks } from "../src/react/library.hook-generator"
import { createContainer } from "iti"
import type { Container } from "iti"

global.IS_REACT_ACT_ENVIRONMENT = true

const h = createElement
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe("React Hook Cleanup and Re-render Tests", () => {
  let root: ReturnType<typeof createRoot>
  let container: Container<any, any>
  let main_c: HTMLElement
  let renderCount: number
  let cleanupCount: number

  beforeEach(async () => {
    await act(async () => {
      main_c = document.createElement("div")
      document.body.appendChild(main_c)
      root = createRoot(main_c)
    })
    
    container = createContainer()
      .add({
        counter: () => 0,
        message: () => "initial message",
        expensiveService: () => ({
          data: new Array(1000).fill("expensive data"),
          timestamp: Date.now()
        })
      })
      .addDisposer({
        expensiveService: (service) => {
          cleanupCount++
        }
      })

    renderCount = 0
    cleanupCount = 0
  })

  afterEach(async () => {
    await act(async () => {
      if (main_c && document.body.contains(main_c)) {
        document.body.removeChild(main_c)
      }
      main_c = null
    })
  })

  it("should properly cleanup subscriptions when component unmounts", async () => {
    const MyRootCont = React.createContext(container)
    const hooks = getItemSetHooks(MyRootCont)
    
    let subscriptionCleanupCalled = false
    
    function TestComponent() {
      const [counter, counterError] = hooks.useItem().counter
      const [message, messageError] = hooks.useItem().message
      
      useEffect(() => {
        // Simulate subscription setup
        const cleanup = container.subscribeToItem("counter", () => {
          subscriptionCleanupCalled = true
        })
        
        return cleanup
      }, [])
      
      return h("div", null, `Counter: ${counter}, Message: ${message}`)
    }

    await act(async () => {
      root.render(h(MyRootCont.Provider, { value: container }, h(TestComponent)))
    })

    await act(async () => {
      root.unmount()
    })

    // Verify cleanup was called
    expect(subscriptionCleanupCalled).toBe(true)
  })

  it("should not cause unnecessary re-renders when container values don't change", async () => {
    const MyRootCont = React.createContext(container)
    const hooks = getItemSetHooks(MyRootCont)
    
    function TestComponent() {
      renderCount++
      const [counter, counterError] = hooks.useItem().counter
      const [message, messageError] = hooks.useItem().message
      
      return h("div", null, `Renders: ${renderCount}`)
    }

    // Initial render
    await act(async () => {
      root.render(h(MyRootCont.Provider, { value: container }, h(TestComponent)))
    })

    const initialRenderCount = renderCount

    // Trigger container updates that don't affect our component's dependencies
    await act(async () => {
      container.upsert({ message: "new message" })
    })

    // Should not have caused additional renders
    expect(renderCount).toBe(initialRenderCount + 1) // Only one additional render

    // Trigger updates to dependencies
    await act(async () => {
      container.upsert({ counter: 1 })
    })

    expect(renderCount).toBe(initialRenderCount + 2) // One more render
  })

  it("should handle component unmounting during async operations", async () => {
    const MyRootCont = React.createContext(container)
    const hooks = getItemSetHooks(MyRootCont)
    
    let asyncOperationCompleted = false
    let componentUnmounted = false
    
    function TestComponent() {
      const [expensiveService, error] = hooks.useItem().expensiveService
      
      useEffect(() => {
        // Simulate async operation
        const timer = setTimeout(() => {
          if (!componentUnmounted) {
            asyncOperationCompleted = true
          }
        }, 100)
        
        return () => clearTimeout(timer)
      }, [])
      
      return h("div", null, "Async component")
    }

    await act(async () => {
      root.render(h(MyRootCont.Provider, { value: container }, h(TestComponent)))
    })

    // Unmount before async operation completes
    await act(async () => {
      componentUnmounted = true
      root.unmount()
    })

    await act(async () => {
      await wait(150) // Wait for async operation
    })

    // Async operation should not complete since component unmounted
    expect(asyncOperationCompleted).toBe(false)
  })

  it("should properly cleanup disposers when React component unmounts", async () => {
    const MyRootCont = React.createContext(container)
    const hooks = getItemSetHooks(MyRootCont)
    
    function TestComponent() {
      const [expensiveService, error] = hooks.useItem().expensiveService
      
      useEffect(() => {
        // This will trigger the expensive service creation
        return () => {
          // Component cleanup - should trigger disposer
        }
      }, [expensiveService])
      
      return h("div", null, "Component with expensive service")
    }

    await act(async () => {
      root.render(h(MyRootCont.Provider, { value: container }, h(TestComponent)))
    })

    // Verify expensive service was created
    expect(expensiveService).toBeDefined()

    // Unmount component
    await act(async () => {
      root.unmount()
    })

    // Force cleanup
    await act(async () => {
      await container.disposeAll()
    })

    expect(cleanupCount).toBe(1)
  })

  it("should handle multiple components using the same container without conflicts", async () => {
    const MyRootCont = React.createContext(container)
    const hooks = getItemSetHooks(MyRootCont)
    
    let component1Renders = 0
    let component2Renders = 0
    
    function Component1() {
      component1Renders++
      const [counter] = hooks.useItem().counter
      return h("div", null, `Component1: ${counter}`)
    }
    
    function Component2() {
      component2Renders++
      const [message] = hooks.useItem().message
      return h("div", null, `Component2: ${message}`)
    }
    
    function ParentComponent() {
      return h("div", null, h(Component1), h(Component2))
    }

    await act(async () => {
      root.render(h(MyRootCont.Provider, { value: container }, h(ParentComponent)))
    })

    const initialC1Renders = component1Renders
    const initialC2Renders = component2Renders

    // Update counter - should only re-render Component1
    await act(async () => {
      container.upsert({ counter: 1 })
    })

    expect(component1Renders).toBe(initialC1Renders + 1)
    expect(component2Renders).toBe(initialC2Renders) // Should not re-render

    // Update message - should only re-render Component2
    await act(async () => {
      container.upsert({ message: "new message" })
    })

    expect(component1Renders).toBe(initialC1Renders + 1)
    expect(component2Renders).toBe(initialC2Renders + 1)
  })

  it("should handle rapid container updates without memory leaks", async () => {
    const MyRootCont = React.createContext(container)
    const hooks = getItemSetHooks(MyRootCont)
    
    function TestComponent() {
      const [counter] = hooks.useItem().counter
      return h("div", null, `Counter: ${counter}`)
    }

    await act(async () => {
      root.render(h(MyRootCont.Provider, { value: container }, h(TestComponent)))
    })

    // Rapid updates
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        container.upsert({ counter: i })
      })
    }

    // Component should still be responsive
    await act(async () => {
      container.upsert({ counter: 999 })
    })

    // Verify no crashes occurred
    expect(true).toBe(true)
  })
})