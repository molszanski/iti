import { createContainer } from "iti"

/*
// Part 1: You can create a circular dependency
// in your business logic
┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐
│ A │──▶│ B │──▶│ C │──▶│ D │──▶│ E │
└───┘   └───┘   └───┘   └───┘   └───┘
                  ▲               │
                  │               │
                  └───────────────┘
*/
class A {
  constructor() {}
}
class B {
  constructor(a: A) {}
}
class C {
  constructor(b: B, e: E) {}
}
class D {
  constructor(c: C) {}
}
class E {
  constructor(d: E) {}
}

// Part 2: You can't express a circular dependency because of typescript checks
createContainer()
  .add((ctx) => ({
    a: () => new A(),
  }))
  .add((ctx) => ({
    b: () => new B(ctx.a),
  }))
  .add((ctx) => ({
    // This line will throw a Typescript error at compile time
    c: () => new C(ctx.a, ctx.e),
  }))
