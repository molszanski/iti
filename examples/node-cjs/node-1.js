const iti = require("iti")

const container = iti
  .createContainer()
  .add({
    doggoName: "Moon Moon",
  })
  .add((c) => ({
    sayName: () => console.log("Doggo's name is " + c.doggoName),
  }))
let a = container.items.sayName
let b = container.items.doggoName

console.log(a, b)
