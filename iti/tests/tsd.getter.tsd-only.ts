import { expectType, expectNotType } from "tsd"

import { createContainer } from "../src/iti"

enum UniqueResult {
  A,
  B,
  C,
  D,
}
// results produced by an add should valid
;(async () => {
  const node = createContainer()
    .add({
      a: UniqueResult.A,
      b: () => UniqueResult.B,
    })
    .add(() => ({
      c: () => UniqueResult.C,
    }))

  expectType<UniqueResult>(node.get("a"))
  expectType<UniqueResult.B>(node.get("b"))
  expectType<UniqueResult.C>(node.get("c"))

  expectNotType<any>(node)
})()
