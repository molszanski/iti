import { expectType, expectNotType } from "tsd"
import {
  useMockAppContainer,
  useMockAppContainerSet,
} from "./mocks/_mock-app-hooks"
import { A_Container } from "./mocks/container.a"
import { B_Container } from "./mocks/container.b"
import { C_Container } from "./mocks/container.c"
import { MockAppWrapper } from "./mocks/_mock-app-components"

// useMockAppContainer should not return `any` type"
;(() => {
  const containers = useMockAppContainer()
  expectNotType<any>(containers)
})()

// useMockAppContainer should test if useMockAppContainer gets correct types
;(() => {
  const [aContainer] = useMockAppContainer().aCont
  expectType<undefined | A_Container>(aContainer)

  if (aContainer != null) {
    expectType<A_Container>(aContainer)
  }
})()

// useMockAppContainerSet should not return any
;(() => {
  const containerSet = useMockAppContainerSet(["aCont", "bCont"])
  expectNotType<any>(containerSet)
})()

// useMockAppContainerSet should return exact types
;(() => {
  const [containerSet, containerSetErr] = useMockAppContainerSet([
    "aCont",
    "bCont",
  ])

  const [containerSet2, containerSetErr2] = useMockAppContainerSet((c) => [
    c.aCont,
    c.bCont,
  ])

  if (containerSet != null) {
    expectType<A_Container>(containerSet.aCont)
    // expectType<undefined>(containerSet.cCont)
  }

  if (containerSet2 != null) {
    expectType<B_Container>(containerSet2.bCont)
    // expectType<undefined>(containerSet.cCont)
  }
})()
