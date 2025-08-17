import { createContainer } from "iti"
import { Client } from "pg"

class A {}

createContainer()
  .add({
    db: async () => {
      const pg = new Client(process.env["DB_CONNECTION_URL"])
      await pg.connect()
      return pg
    },
  })
  .add((ctx) => ({
    a: () => new A(),
    b: async () => {
      const db = await ctx.db
      db.query("SELECT 1")
    },
  }))
  //             ↓ `ctx` to access any other dependency
  .addDisposer((ctx) => ({
    //    ↓ `db` is a resolved value of a `DB`
    db: (db) => {
      console.log(ctx.a)
      return db.disconnect()
    },
  }))

class B {}
const container = createContainer()
  .add({
    a: () => new A(),
    b: () => new B(),
  })
  .addDisposer({
    a: (a) => console.log("disposing a", a),
  })

container.dispose("a")
