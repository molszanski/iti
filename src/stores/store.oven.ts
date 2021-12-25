import { makeAutoObservable, computed } from "mobx"
import type { Pizza } from "./store.pizza"

const BAKING_TIME_MS = 400

export class Oven {
  public currentTemperature = 20
  private pizzaCapacity = 4
  public pizzasInside = 4
  public pizInside: Pizza[] = []

  constructor() {
    console.log("new Oven")
    makeAutoObservable(this)
  }

  public bakePizza(pizza: Pizza) {
    if (this.pizzasInOven() < this.pizzaCapacity) {
      this.pizInside.push(pizza)
      setTimeout(() => {
        pizza.state = "baked"
      }, BAKING_TIME_MS)
    }
  }

  @computed
  public pizzasInOven() {
    return this.pizInside.length
  }
}
