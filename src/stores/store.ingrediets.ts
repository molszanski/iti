import {
  makeAutoObservable,
  makeObservable,
  action,
  computed,
  observable,
} from "mobx"
import _sample from "lodash/sample"
import _pullAt from "lodash/pullAt"
import _countBy from "lodash/countBy"

export class Ingredients {
  public ingredients: Ingredient[] = []

  constructor() {
    makeObservable(this, {
      ingredients: observable,
      addNewIngredient: action,
      getRandomPizzaIngredients: action,
      ingredientsStats: computed,
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

  public get ingredientsStats() {
    const stats = _countBy(this.ingredients, (ing) => ing.name)
    return Object.entries(stats)
  }
}

export class Ingredient {
  constructor(public name: string) {
    makeAutoObservable(this)
  }
}
