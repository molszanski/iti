import { makeAutoObservable } from "mobx"

export class Ingrediets {
  public ingredients: Ingredient[] = []

  constructor() {
    makeAutoObservable(this)
  }

  public addNewIngredients(n: string) {
    console.log("adding new ingredient ")
    this.ingredients.push(new Ingredient(n))
  }
}

export class Ingredient {
  constructor(public name: string) {
    makeAutoObservable(this)
  }
}
