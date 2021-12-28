import { makeAutoObservable, makeObservable, action, observable } from "mobx"
import _sample from "lodash/sample"
import _pullAt from "lodash/pullAt"

export class Ingredients {
  public ingredients: Ingredient[] = []

  constructor() {
    // makeAutoObservable(this)
    makeObservable(this, {
      ingredients: observable,
      addNewIngredient: action,
      getRandomPizzaIngredients: action,
    })
  }

  public addNewIngredient(n: string) {
    console.log("adding new ingredient ")
    this.ingredients.push(new Ingredient(n))
  }

  public getRandomPizzaIngredients() {
    let pi: Ingredient[] = []

    let k = 4
    while (k > 0) {
      const i = Math.floor(Math.random() * this.ingredients.length)
      console.log(i)
      pi.push(this.ingredients[i])
      _pullAt(this.ingredients, i)
      k--
      console.log(this.ingredients)
      console.log(pi)
      console.log("-----------")
    }
    return pi
  }
}

export class Ingredient {
  constructor(public name: string) {
    makeAutoObservable(this)
  }
}
