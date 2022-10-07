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

class A {}
class X {}
class B { constructor(a: A) {} }
class C { constructor(a: A) {} }
class D { constructor(b: B, c: C, x: X) {} }
class L { constructor(d: D) {} }
class K { constructor(d: D) {} }
class E { constructor(c: C, d: D) {} }
class M { constructor(e: E) {} }
class F { constructor(e: E) {} }

export { A, X, B, C, D, L, K, E, M, F }
