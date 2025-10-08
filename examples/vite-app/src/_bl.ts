import { createContainer } from "iti"

export class A {}
export class B {
  constructor(a: A) {}
}
export class C {
  constructor(a: A) {}
}
export class D {
  constructor(c: C) {}
}

export const app = createContainer()
  .add(() => ({
    a: () => new A(),
    x: () => "x",
    y: () => "y",
  }))
  .add((ctx) => ({
    b: async () => new B(ctx.a),
  }))
  .add((ctx) => ({
    c: async () => new C(ctx.a),
  }))
  .add((ctx) => ({
    d: async () => {
      console.log("ctx.c", await ctx.c)
      return new D(await ctx.c)
    },
  }))
