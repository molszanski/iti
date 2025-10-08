import { describe, it, expect, vi, beforeEach } from "vitest"
import { createContainer } from "../src"
import { wait } from "./_utils"

describe("Disposing: ", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
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
      a: vi.fn(),
      db: vi.fn(),
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
      a: vi.fn(),
      db: vi.fn(),
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

describe("Individual disposing: ", () => {
  let root = createContainer()
  let disposerOfA = vi.fn()
  let cont = root.add({ a: "A" }).addDisposer({ a: disposerOfA })

  beforeEach(() => {
    disposerOfA.mockReset()
    root = createContainer()
    cont = root.add({ a: "A" }).addDisposer({ a: disposerOfA })
  })

  it("should dispose a resolved value call a never resolved object", async () => {
    cont.get("a")
    await cont.dispose("a")
    expect(disposerOfA).toHaveBeenCalledTimes(1)
  })

  it("should not call a never resolved object", async () => {
    await cont.dispose("a")
    expect(disposerOfA).toHaveBeenCalledTimes(0)
  })

  it("should not call dispose on already disposed object", async () => {
    cont.get("a")
    await cont.dispose("a")
    await cont.dispose("a")

    expect(disposerOfA).toHaveBeenCalledTimes(1)
  })

  it("should emit a dispose event when disposed", () => {
    return new Promise(async (resolve) => {
      cont.get("a")
      cont.on("containerDisposed", (payload) => {
        expect(payload.key).toBe("a")
        resolve(true)
      })
      cont.dispose("a")
    })
  })
})

describe("Disposing complex async: ", () => {
  let root = createContainer()

  beforeEach(() => {
    root = createContainer()
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

  it("should call async dispose with correct instances and correct times", async () => {
    const disposerDb = vi.fn()
    const cont = createContainer()
      .add({
        db: () => new DB(),
      })
      .addDisposer((ctx) => ({
        db: async (db) => {
          expect((await ctx.db) instanceof DB).toBe(true)
          expect(db instanceof DB).toBe(true)
          disposerDb()
          return
        },
      }))

    cont.get("db")
    await cont.dispose("db")
    await cont.dispose("db")

    expect(disposerDb).toHaveBeenCalledTimes(1)
  })
})
