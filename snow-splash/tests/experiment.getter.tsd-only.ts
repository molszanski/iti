import { expectType, expectNotType } from "tsd"

import { makeRoot } from "../src/library.new-root-container"

enum UniqueResult {
  A,
  B,
  C,
  D,
}
// results produced by addNode should valid
;(async () => {
  const node = makeRoot()
    .addNode({
      a: UniqueResult.A,
      b: () => UniqueResult.B,
    })
    .addNode(async () => ({
      c: () => UniqueResult.C,
    }))

  expectType<UniqueResult>(await node.get("a"))
  expectType<UniqueResult.B>(await node.get("b"))
  expectType<UniqueResult.C>(await node.get("c"))

  expectNotType<any>(node)
})()
