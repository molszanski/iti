import { makeAutoObservable, computed } from "mobx"
import type { Pizza } from "./store.pizza"

const BAKING_TIME_MS = 400
const BAKING_TEMPERATURE = 260

export class Oven {
  public currentTemperature = 20
  public pizInside: Pizza[] = []

  constructor(private pizzaCapacity = 4) {
    console.log("new Oven. capacity:", this.pizzaCapacity)
    makeAutoObservable(this)
  }

  public async preheatOven() {
    setTimeout(() => {
      this.updateTemperature(BAKING_TEMPERATURE)
    }, 200)
  }

  public async bakePizza(pizza: Pizza) {
    if (this.currentTemperature < BAKING_TEMPERATURE) {
      await this.preheatOven()
    }

    if (this.pizzasInOven() < this.pizzaCapacity) {
      this.addPizzaToOven(pizza)
      setTimeout(() => {
        pizza.updatePizzaState("baked")
      }, BAKING_TIME_MS)
    }
  }

  private updateTemperature(nc: number) {
    this.currentTemperature = nc
  }

  private addPizzaToOven(p: Pizza) {
    this.pizInside.push(p)
  }

  @computed
  public pizzasInOven() {
    return this.pizInside.length
  }
}
