import { attest } from "@ark/attest"
import { describe, it } from "vitest"
import { useMockAppItem, useMockAppItemSet } from "./mocks/_mock-app-hooks"
import type { A_Container } from "./mocks/container.a"
import type { B_Container } from "./mocks/container.b"
import type { C_Container } from "./mocks/container.c"
import { MockAppWrapper } from "./mocks/_mock-app-components"

describe("React hooks type tests", () => {
  it("useMockAppItem should not return `any` type", () => {
    const items = useMockAppItem()
    // Ensure containers is not of type `any` by checking it has specific structure
    attest(items).type.toString.snap()
    attest.instantiations([1000, "instantiations"])
  })

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
