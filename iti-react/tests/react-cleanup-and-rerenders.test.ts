import React, { createElement } from "react"
import { createContainer } from "iti"
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "./test-utils"
import { getContainerHooks } from "../src/react/library.hook-generator"

const h = createElement

afterEach(cleanup)

describe("React hook subscriptions", () => {
  it("only rerenders consumers of the updated item", async () => {
    const container = createContainer().add({
      counter: 0,
      message: "initial",
    })
    const ContainerContext = React.createContext(container)
    const { useItem } = getContainerHooks(ContainerContext)
    const counterRender = vi.fn()
    const messageRender = vi.fn()

    function Counter() {
      counterRender()
      const [counter] = useItem().counter
      return h("span", null, `Counter: ${counter}`)
    }

    function Message() {
      messageRender()
      const [message] = useItem().message
      return h("span", null, `Message: ${message}`)
    }

    function Controls() {
      return h(
        React.Fragment,
        null,
        h(
          "button",
          { onClick: () => container.upsert({ counter: 1 }) },
          "Update counter",
        ),
        h(
          "button",
          { onClick: () => container.upsert({ message: "updated" }) },
          "Update message",
        ),
      )
    }

    render(
      h(
        ContainerContext.Provider,
        { value: container },
        h(Counter),
        h(Message),
        h(Controls),
      ),
    )

    await screen.findByText("Counter: 0")
    await screen.findByText("Message: initial")
    const initialCounterRenders = counterRender.mock.calls.length
    const initialMessageRenders = messageRender.mock.calls.length

    fireEvent.click(screen.getByRole("button", { name: "Update counter" }))
    await screen.findByText("Counter: 1")
    expect(counterRender).toHaveBeenCalledTimes(initialCounterRenders + 1)
    expect(messageRender).toHaveBeenCalledTimes(initialMessageRenders)

    fireEvent.click(screen.getByRole("button", { name: "Update message" }))
    await screen.findByText("Message: updated")
    expect(counterRender).toHaveBeenCalledTimes(initialCounterRenders + 1)
    expect(messageRender).toHaveBeenCalledTimes(initialMessageRenders + 1)
  })

  it("unsubscribes every item listener when the consumer unmounts", async () => {
    const container = createContainer().add({ counter: 0 })
    const ContainerContext = React.createContext(container)
    const { useItem } = getContainerHooks(ContainerContext)
    const originalSubscribe = container.subscribeToItem.bind(container)
    const unsubscribers: ReturnType<typeof vi.fn>[] = []

    vi.spyOn(container, "subscribeToItem").mockImplementation((token, cb) => {
      const unsubscribe = vi.fn(originalSubscribe(token, cb))
      unsubscribers.push(unsubscribe)
      return unsubscribe
    })

    function Counter() {
      const [counter] = useItem().counter
      return h("span", null, `Counter: ${counter}`)
    }

    const rendered = render(
      h(ContainerContext.Provider, { value: container }, h(Counter)),
    )

    await screen.findByText("Counter: 0")
    expect(unsubscribers.length).toBeGreaterThan(0)

    rendered.unmount()

    await waitFor(() => {
      expect(
        unsubscribers.every(
          (unsubscribe) => unsubscribe.mock.calls.length === 1,
        ),
      ).toBe(true)
    })
  })
})
