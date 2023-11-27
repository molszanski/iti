const { createContainer } = require("iti")

function Doggo(name) {
  return {
    greetText: "Doggo name is " + name,
  }
}

let root = createContainer()
  .add({
    doggoName: "Moon Moon",
  })
  .add((c) => ({
    doggo: () => new Doggo(c.doggoName),
  }))
  .add((c) => ({
    sayName: () => {
      console.log(c.doggo.greetText)
    },
  }))
root.get("sayName")
