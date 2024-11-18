import { describe, it, expect, beforeEach, vi } from "vitest"
import { createContainer } from "../src/iti"
import { getMainMockAppContainer } from "./mocks/_mock-app-container"
import { wait } from "./_utils"

describe("Getter tests", () => {
  let c0 = createContainer()
  beforeEach(() => (c0 = createContainer()))

  it("should get a single container", async () => {
    const cont = getMainMockAppContainer()
    expect(cont.items).toHaveProperty("bCont")
    expect(cont.items.aCont).toBeInstanceOf(Promise)

    let b = await cont.items.bCont
    expect(b).toHaveProperty("b2")
    expect(b).toMatchSnapshot()
  })

  it("should subscribe to a single container", async () => {
    const cont = getMainMockAppContainer()
    expect(cont.items).toHaveProperty("bCont")
    expect(cont.items.aCont).toBeInstanceOf(Promise)

    let m = vi.fn()
    cont.subscribeToContainer("cCont", m)
    let cCont = await cont.get("cCont")
    cCont.upgradeCContainer()

    let c = await cont.get("cCont")
    expect(m).toHaveBeenCalled()
    expect(c.c2.size).toBe(10)
    await wait(20)
  })
})
