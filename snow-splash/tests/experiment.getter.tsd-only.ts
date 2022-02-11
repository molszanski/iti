import { expectType, expectNotType } from "tsd"

import { makeRoot } from "../src/library.new-root-container"

enum UniqueResult {
  A,
  B,
  C,
  D,
}
// results produced by an upsert should valid
;(async () => {
  const node = makeRoot()
    .upsert({
      a: UniqueResult.A,
      b: () => UniqueResult.B,
    })
    .upsert(() => ({
      c: () => UniqueResult.C,
    }))

  expectType<UniqueResult>(node.get("a"))
  expectType<UniqueResult.B>(node.get("b"))
  expectType<UniqueResult.C>(node.get("c"))

  expectNotType<any>(node)
})()
