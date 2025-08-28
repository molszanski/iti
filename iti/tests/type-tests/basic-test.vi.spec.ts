import { attest } from "@ark/attest"
import { describe, it, expect, beforeEach, vi } from "vitest"

import { getMainMockAppContainer } from "../mocks/_mock-app-container"
import type { A_Container } from "../mocks/container.a"
import type { B_Container } from "../mocks/container.b"
import type { C_Container } from "../mocks/container.c"

type MockTokens = {
  aCont: "aCont"
  bCont: "bCont"
  cCont: "cCont"
}

const wait = (w: number) => new Promise((r) => setTimeout(r, w))

describe("Type tests:", () => {
  // let cont = getMainMockAppContainer()
  // beforeEach(() => (cont = getMainMockAppContainer()))

  it("should check container types", async () => {
    const cont = getMainMockAppContainer()

    attest<A_Container>(await cont.items.aCont)
    attest<B_Container>(await cont.get("bCont"))
    attest<Promise<C_Container>>(cont.items.cCont)

    attest.instantiations([2860, "instantiations"])
  })

  it("should check token types", () => {
    attest<MockTokens>(getMainMockAppContainer().getTokens())
    attest.instantiations([2605, "instantiations"])
  })

  it("should check getContainerSet types", async () => {
    const cont = getMainMockAppContainer()
    const itemSet = await cont.getContainerSet(["aCont", "bCont"])

    attest<A_Container>(itemSet.aCont)
    attest<B_Container>(itemSet.bCont)
    attest<{
      aCont: A_Container
      bCont: B_Container
    }>(itemSet)
    attest.instantiations([2768, "instantiations"])
  })

  it("should check getContainerSet function types", async () => {
    const cont = getMainMockAppContainer()
    const itemSet = await cont.getContainerSet((c) => [c.aCont, c.bCont])
    attest<A_Container>(itemSet.aCont)
    attest<B_Container>(itemSet.bCont)
    attest<{
      aCont: A_Container
      bCont: B_Container
    }>(itemSet)

    attest.instantiations([2811, "instantiations"])
  })

  it("should check getContainerSet cb has proper tokens", () => {
    getMainMockAppContainer().getContainerSet((c) => {
      attest<MockTokens>(c)
      return [c.aCont]
    })
    attest.instantiations([2692, "instantiations"])
  })

  it("should have subscribeToContainerSet types valid", async () => {
    const cont = getMainMockAppContainer()
    const a = vi.fn()
    let itemSet = await cont.getContainerSet((c) => [c.aCont, c.cCont])
    expect(itemSet).toHaveProperty("aCont")

    // WARNING!!
    // This is a bit "magical test"
    // attest(() => itemSet.bCont).type.errors(
    // will cause this test to fail in an unexpected way
    // anyway fix (or comment it out) and see how it works without it

    cont.subscribeToContainerSet(
      (c) => {
        attest<MockTokens>(c)
        attest<"aCont">(c.aCont)
        a()
        return [c.aCont, c.cCont]
      },
      (err, itemSet) => {
        attest<A_Container>(itemSet.aCont)
        attest<C_Container>(itemSet.cCont)
        attest<{
          aCont: A_Container
          cCont: C_Container
        }>(itemSet)
        a()

        // @ts-expect-error
        attest(() => itemSet.bCont).type.errors(
          "Property 'bCont' does not exist on type '{ aCont: A_Container; cCont: C_Container; }'",
        )
      },
    )
    itemSet.cCont.upgradeCContainer()
    await wait(10)
    expect(a).toHaveBeenCalledTimes(3)
    attest.instantiations([3213, "instantiations"])
  })

  it("should be able to delete token types", () => {
    const cont = getMainMockAppContainer().delete("aCont")
    attest<{ bCont: "bCont"; cCont: "cCont" }>(cont.getTokens())
    attest.instantiations([3213, "instantiations"])
  })
})
