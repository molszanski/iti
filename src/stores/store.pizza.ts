import { makeAutoObservable } from "mobx"
import type { Ingredient } from "./store.ingrediets"

type PizzaState = "raw" | "hasIngredients" | "baked"

export class Pizza {
  public state: PizzaState = "raw"

  constructor(public ingredients: Ingredient[]) {
    console.log("new pizza with ingredients created")
    makeAutoObservable(this)
  }
}
