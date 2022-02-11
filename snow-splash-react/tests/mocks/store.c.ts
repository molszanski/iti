import type { A1, A2 } from "./store.a"
import { B2 } from "./store.b"

export class C1 {
  constructor(private a2: A2) {
    // 1. Subscribe to event emitter
    // 2. Pub update
  }
}
export class C2 {
  constructor(private a1: A1, b2: B2, readonly size) {}
}
