import { Client } from "pg"
import { createContainer } from "iti"

const container = createContainer()
  .add(() => ({
    dbConnection: async () => {
      const pg = new Client(process.env["DB_CONNECTION_URL"])
      await pg.connect()
      return pg
    },
  }))
  .addDisposer({
    dbConnection: (dbConnection) => dbConnection.end(),
  })

const db = await container.get("dbConnection")
await db.query("...")

// Later..
await container.disposeAll()

console.log("All dependencies disposed, you can exit now. :)")
