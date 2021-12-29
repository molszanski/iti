import { makeAutoObservable, makeObservable, action, observable } from "mobx"
import _sample from "lodash/sample"
import _pullAt from "lodash/pullAt"

export class Ingredients {
  public ingredients: Ingredient[] = []

  constructor() {
    makeObservable(this, {
      ingredients: observable,
      addNewIngredient: action,
      getRandomPizzaIngredients: action,
    })
  }

  public addNewIngredient(n: string) {
    this.ingredients.push(new Ingredient(n))
  }

  public getRandomPizzaIngredients() {
    let pi: Ingredient[] = []

    let k = 4
    while (k > 0) {
      const i = Math.floor(Math.random() * this.ingredients.length)
      pi.push(this.ingredients[i])
      _pullAt(this.ingredients, i)
      k--
    }
    return pi
  }
}

export class Ingredient {
  constructor(public name: string) {
    makeAutoObservable(this)
  }
}
