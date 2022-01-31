import { getMainMockAppContainer } from "./mocks/_mock-app-container"
import { expectType, expectError, printType, expectNotType } from "tsd"
import { A_Container } from "./mocks/container.a"
import { B_Container } from "./mocks/container.b"
import { C_Container } from "./mocks/container.c"

it("should check token types", () => {
  const cont = getMainMockAppContainer()
  expectType<("aCont" | "bCont" | "cCont")[]>(cont.tokens)
})

it("should check getContainerSet types", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSet(["aCont", "bCont"])
  expectNotType<any>(containerSet)
  expectNotType<any>(containerSet.aCont)
  expectType<A_Container>(containerSet.aCont)
})

it("should check getContainerSetNew  types", async () => {
  const cont = getMainMockAppContainer()
  let containerSet = await cont.getContainerSetNew((c) => [c.aCont, c.bCont])
  expectNotType<any>(containerSet)
  expectNotType<any>(containerSet.aCont)
  expectType<A_Container>(containerSet.aCont)
})

it("should check subscribe types", async () => {
  const cont = getMainMockAppContainer()
  cont.subscribeToContinerSetNew(
    (c) => {
      expectNotType<any>(c)
      expectType<"aCont">(c.aCont)
      return [c.aCont, c.cCont]
    },
    (containerSet) => {
      expectNotType<any>(containerSet)
      expectType<A_Container>(containerSet.aCont)
      expectType<C_Container>(containerSet.cCont)
    },
  )
})
