import {
  makeObservable,
  makeAutoObservable,
  observable,
  computed,
  action,
} from "mobx"

export class PizzaPlace {
  public isOpen = false
  public name = "Rocket Pizza"

  constructor() {
    console.log("new pizza place")
    // makeAutoObservable(this)
    makeObservable(this, {
      isOpen: observable,
      openPizzaPlace: action,
      closePizzaPlace: action,
    })
  }

  public openPizzaPlace() {
    this.isOpen = true
  }

  public closePizzaPlace() {
    this.isOpen = false
  }
}

export class DiningTables {
  public tables: Table[] = []

  constructor() {
    makeAutoObservable(this)
  }

  public addNewTable() {
    console.log("adding new tables")
    const name = (this.tables.length + 1).toString()
    this.tables.push(new Table(name))
  }
}

class Table {
  isEmpty = true
  constructor(public name: string) {
    makeAutoObservable(this)
  }
}
