import { expect, jest, describe, beforeEach, it } from "@jest/globals"
import { makeRoot } from "../src"
import { wait } from "./_utils"

describe("Disposing: ", () => {
  let root: ReturnType<typeof makeRoot>

  beforeEach(() => {
    root = makeRoot()
  })

  class DB {
    public connected = false
    constructor() {}
    async connect() {
      this.connected = true
      await wait(10)
    }
    async disconnect() {
      await wait(20)
      this.connected = false
    }
  }

  it("should be able to call disposeAll", async () => {
    const disposers = {
      a: jest.fn(),
      db: jest.fn(),
    }
    let r = root
      .add({ x: "test", y: null })
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
        db: (db) => {
          disposers.db()
          return db.disconnect()
        },
        a: () => disposers.a(),
      }))

    const db = await r.get("db")
    expect(db.connected).toBe(true)

    await r.disposeAll()
    expect(db.connected).toBe(false)

    expect(r.get("a")).toBe("A")
    await wait(3)
    expect(disposers.db).toHaveBeenCalledTimes(1)
    expect(disposers.a).toHaveBeenCalledTimes(0)
  })

  it("should NOT call dispose on items we have not resolved", async () => {
    const disposers = {
      a: jest.fn(),
      db: jest.fn(),
    }

    let r = root
      .add({
        a: "A",
        db: () => new DB(),
      })
      .addDisposer((ctx) => ({
        db: (db) => {
          disposers.db()
          return db.disconnect()
        },
        a: () => disposers.a(),
      }))

    await r.get("db")
    await r.disposeAll()
    expect(disposers.db).toHaveBeenCalledTimes(1)
    expect(disposers.a).not.toHaveBeenCalled()
  })

  it("should throw if we add the same disposers", async () => {
    root
      .add({
        a: "A",
      })
      .addDisposer(() => ({
        a: () => {},
      }))

    expect(() => {
      root.addDisposer(() => ({
        a: () => {},
      }))
    }).toThrow()
  })
})
