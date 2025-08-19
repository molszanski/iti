import { attest } from "@ark/attest"
import { describe, it, expect } from "vitest"
import { createContainer } from "../../src/iti"
import dedent from "dedent"

import { getMainMockAppContainer } from "../mocks/_mock-app-container"
import type { A_Container } from "../mocks/container.a"
import type { B_Container } from "../mocks/container.b"
import type { C_Container } from "../mocks/container.c"

it("should check container types", async () => {
  const cont = getMainMockAppContainer()

  attest<A_Container>(await cont.items.aCont)
  attest<B_Container>(await cont.get("bCont"))
  attest<Promise<C_Container>>(cont.items.cCont)
  attest.instantiations([2860, "instantiations"])
})

it("should check token types", () => {
  const cont = getMainMockAppContainer()
  attest<{ aCont: "aCont"; bCont: "bCont"; cCont: "cCont" }>(cont.getTokens())
  attest.instantiations([2605, "instantiations"])
})

it("should check getContainerSet types", async () => {
  const cont = getMainMockAppContainer()
  let itemSet = await cont.getContainerSet(["aCont", "bCont"])

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
  let itemSet = await cont.getContainerSet((c) => [c.aCont, c.bCont])
  attest<A_Container>(itemSet.aCont)
  attest<B_Container>(itemSet.bCont)
  attest<{
    aCont: A_Container
    bCont: B_Container
  }>(itemSet)

  attest.instantiations([2811, "instantiations"])
})
