import { makeObservable, makeAutoObservable, observable, action } from "mobx"
import type { FatLib2_3MB } from "../fat-libs/fat-lib2"

export class PizzaPlace {
  public isOpen = false
  public name = "Rocket Pizza"

  constructor(private fatlib: () => Promise<FatLib2_3MB>) {
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

  public async getFatLibImage() {
    const fatLib = await this.fatlib()
    return fatLib.getData()
  }
}

export class DiningTables {
  public tables: Table[] = []

  constructor() {
    makeAutoObservable(this)
  }

  public addNewTable() {
    console.log("adding new table")
    const name = (this.tables.length + 1).toString()
    this.tables.push(new Table(name))
  }
}

export class Table {
  isEmpty = true
  constructor(public name: string) {
    makeAutoObservable(this)
  }
}
