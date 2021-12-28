import { makeAutoObservable } from "mobx"
import type { Ingredients } from "./store.ingrediets"
import type { Oven } from "./store.oven"
import { Pizza } from "./store.pizza"
import type { Table } from "./store.pizza-place"

export class Kitchen {
  public orders: Order[] = []

  constructor(private oven: Oven, private ingredients: Ingredients) {
    console.log("new oven")
    makeAutoObservable(this)
  }

  public async orderPizza(table: Table) {
    let i = this.ingredients.getRandomPizzaIngredients()
    let p = new Pizza(i)

    this.orders.push(new Order(p, table))

    this.oven.bakePizza(p)
  }
}

class Order {
  constructor(public pizza: Pizza, public table: Table) {}
}
