import { makeAutoObservable } from "mobx"
import type { Ingredients } from "./store.ingrediets"
import type { Oven } from "./store.oven"
import { Pizza } from "./store.pizza"
import type { Table } from "./store.pizza-place"
import debug from "debug"
const log = debug("oven")

export class Kitchen {
  public kitchenName: string

  constructor(private oven: Oven, private ingredients: Ingredients) {
    this.kitchenName = "Random Name " + Math.round(Math.random() * 100)
    log("new kitchen: " + this.kitchenName)

    makeAutoObservable(this)
  }

  public getRandomPizzaIngredients() {
    return this.ingredients.getRandomPizzaIngredients()
  }

  public async bakePizza(p: Pizza) {
    return this.oven.bakePizza(p)
  }
}

export class OrderManager {
  public orders: Order[] = []

  constructor(private kitchen: Kitchen) {
    makeAutoObservable(this)
  }

  public async orderPizza(table: Table) {
    let i = this.kitchen.getRandomPizzaIngredients()
    let p = new Pizza(i)

    this.orders.push(new Order(p, table))

    this.kitchen.bakePizza(p)
  }
}

class Order {
  constructor(public pizza: Pizza, public table: Table) {}
}
