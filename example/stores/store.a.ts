import type { Auth } from "./store.auth"

export class A1 {
  constructor(private auth: Auth) {}
  public getName() {
    return "Jon Snow"
  }
}
export class A2 {
  constructor(private a1: A1, private auth: Auth) {}
}
export class A3 {
  constructor(private a1: A1, private a2: A2) {}
}
