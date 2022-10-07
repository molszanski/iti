import { expect, jest, describe, beforeEach, it } from "@jest/globals"
import { makeRoot } from "../src"
import { wait } from "./_utils"
import { A, X, B, C, D, L, K, E, M, F } from "./mock-graph"

/*
             ┌─────┐
             │  A  │
             └─────┘
       ┌────────┴────────┐
       ▼                 ▼
    ┌─────┐           ┌─────┐
    │  B  │           │  C  │────────────┐
    └─────┘           └─────┘            │
       └────────┬────────┘               │
                ▼                        ▼
┌─────┐      ┌─────┐                  ┌─────┐
│  X  │─────▶│  D  │─────────────────▶│  E  │
└─────┘      └─────┘                  └─────┘
          ┌─────┴────┐              ┌────┴────┐
          ▼          ▼              ▼         ▼
       ┌─────┐    ┌─────┐        ┌─────┐   ┌─────┐
       │  L  │    │  K  │        │  M  │   │  F  │
       └─────┘    └─────┘        └─────┘   └─────┘
*/
function getGraph() {
  return makeRoot()
    .add({ a: () => new A(), x: () => new X() })
    .add((ctx) => ({
      b: () => new B(ctx.a),
      c: () => new C(ctx.a),
    }))
    .add((ctx) => ({
      d: () => new D(ctx.b, ctx.c, ctx.x),
      m: async () => 123,
    }))
}
/**
 * warning, partial graph disposal should not be implemented
 *
 * Due to teh async nature of the problem, the only way to implement it is to
 * track dependencies and dispose them in the reverse order of creation. Visitor pattern.
 * But since there might multiple async resolution requests, we might accidentally "track"
 * an unrelated dependency as a "visited" one.
 *
 * Hence when disposing, we would dispose unrelated dependencies as well.
 *
 * I don't think it would be really that useful anyway.
 *
 */
describe("Disposing graph: [warning, this should never be implemented]", () => {
  let root = getGraph()
  beforeEach(() => {
    root = getGraph()
  })

  it("should call graph", async () => {
    const disposeLog: string[] = []
    const dis = (token: string) => disposeLog.push(token)
    const node = root.addDisposer((ctx, node) => ({
      a: () => dis("a"),
      b: () => dis("b"),
      c: () => dis("c"),
      d: () => dis("d"),
      x: (x) => {
        return dis("x")
      },
    }))

    const d = node.get("d")
    node.dispose("d")

    expect(d).toBeInstanceOf(D)
  })
})
