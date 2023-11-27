import { createContainer } from "iti"

const container = createContainer()
  .add({
    doggoName: "Moon Moon",
  })
  .add((c) => ({
    sayName: () => console.log("Doggo's name is " + c.doggoName),
  }))
container.items.sayName
