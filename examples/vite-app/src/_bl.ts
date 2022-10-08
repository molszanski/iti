import { createContainer } from "iti"

export class A {}
export class B {
  constructor(a: A) {}
}
export class C {
  constructor(a: A, b: B) {}
}

export const app = createContainer()
  .add(() => ({
    a: () => new A(),
  }))
  .add((ctx) => ({
    b: async () => new B(ctx.a),
  }))
  .add((ctx) => ({
    c: () => new C(ctx.a, ctx.b),
  }))
