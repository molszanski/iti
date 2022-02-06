import { expectType, expectNotType } from "tsd"

import { makeRoot } from "../src/library.new-root-container"

enum UniqueResult {
  A,
  B,
  C,
  D,
}
// results produced by addPromise should valid
;(async () => {
  const node = await makeRoot()
    .addNode({
      a: UniqueResult.A,
      b: () => UniqueResult.B,
    })
    .addPromise(async () => ({
      c: () => UniqueResult.C,
    }))
    .seal()

  expectType<UniqueResult>(node.get("a"))
  expectType<UniqueResult.B>(node.get("b"))
  expectType<UniqueResult.C>(node.get("c"))

  expectNotType<any>(node)
})()
