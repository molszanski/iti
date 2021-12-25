import { makeAutoObservable } from "mobx"
import type { Oven } from "./store.oven"

export class Kitchen {
  constructor(private oven: Oven) {
    console.log("new oven")
    makeAutoObservable(this)
  }
}
