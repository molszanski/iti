import type { A1, A2 } from "./store.a"

export class B1 {
  constructor(private a2: A2) {
    // 1. Subscribe to event emitter
    // 2. Pub update
  }
}
export class B2 {
  constructor(private a1: A1) {}
}
