import { makeRoot } from "../src"
import { wait } from "./_utils"

class DB {
  constructor() {}
  async connect() {}
  async disconnect() {
    // console.log("DB disconnecting")
    // await wait(100)
    // console.log("DB disconnected")
  }
}

describe("Disposing: ", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it.only("should be able to call dispose", (cb) => {
    ;(async () => {
      let r = root
        .add({ mf: "Swet JIZSA", bc: null })
        .add({
          a: "A",
          b: null,
          db: async () => {
            const db = new DB()
            await db.connect()
            return db
          },
        })
        .addDisposer((ctx) => ({
          a: () => {
            console.log("disposing a", ctx.a)
          },
          b: (b) => {
            console.log("disposing b", ctx.b)
          },
          db: () => ctx.db.then((db) => db.disconnect()),
        }))

      await r.get("a")
      await r.get("db")

      await r.disposeAll()

      expect(r.get("a")).toBe("A")
      cb()
    })()
  })
})
