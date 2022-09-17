import { makeRoot } from "../src"
import { wait } from "./_utils"

class DB {
  constructor() {}
  async connect() {}
  async disconnect() {
    console.log("DB disconnecting")
    await wait(100)
    console.log("DB disconnected")
  }
}

describe("Disposing: ", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  it.only("should be able to call dispose", (cb) => {
    ;(async () => {
      let x = root
        .add({
          a: "Swet JIZSA sdjfhjsdlfjdsjjflkdsjfklsdmflsk",
          b: 123123123,
        })
        .addDisposer(() => ({
          a: () => "Swet JIZSA sdjfhjsdlfjdsjjflkdsjfklsdmflsk",
          // b: () => 2,
          // d: () => 3,
          // c: () => 123,
        }))
      // .addDisposer(() => ({
      //   a: () => "Swet JIZSA sdjfhjsdlfjdsjjflkdsjfklsdmflsk",
      //   c: () => 123,
      // }))
      // .addDisposer(() => ({
      //   a: () => "Swet JIZSA sdjfhjsdlfjdsjjflkdsjfklsdmflsk",
      //   b: () => 2,
      // }))

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
          db: (db) => db.disconnect(),
          // lol: (df) => "sadf",
        }))

      await r.get("a")
      await r.get("db")

      await r.disposeAll()
      console.log("all disposd")

      expect(r.get("a")).toBe("A")
      cb()
    })()
  })
})
