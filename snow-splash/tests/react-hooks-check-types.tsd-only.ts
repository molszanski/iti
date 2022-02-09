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

// useMockAppContainerSet should not retun any
;(() => {
  const containerSet = useMockAppContainerSet(["aCont", "bCont"])
  expectNotType<any>(containerSet)
})()

// useMockAppContainerSet should return exact types
;(() => {
  const containerSet = useMockAppContainerSet(["aCont", "bCont"])
  if (containerSet != null) {
    expectType<A_Container>(containerSet.aCont)
    // expectType<undefined>(containerSet.cCont)
  }
})()
