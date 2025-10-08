import { describe, it, expect, vi, beforeEach } from "vitest"
import { createContainer } from "../src/iti"

import { wait } from "./_utils"
import { provideAContainer } from "./mocks/container.a"
import { provideBContainer } from "./mocks/container.b"

describe("Node long chain async", () => {
  let cont0 = createContainer()

  beforeEach(() => {
    cont0 = createContainer()
  })

  it("should test long chain", async () => {
    let r = cont0
      .add({ a: "A" })
      .add({ k: "K" })
      .upsert((c, cont) => ({
        a: 22,
        c: async () => {
          expect(c.a).toBe(22)
          return "C"
        },
      }))
      .upsert((c, cont) => ({
        b: "B",
        c: async () => {
          expect(cont.get("a")).toBe(22)
          return "C"
        },
      }))
      .add(() => {
        return { f: "F", g: "G" }
      })

    await expect(r.get("c")).resolves.toBe("C")

    expect(r.get("f")).toBe("F")
    expect(r.get("a")).toBe(22)

    r.upsert({ a: "new A" })
    expect(r.get("a")).toBe("new A")
  }, 100)

  it("should test if I can overwrite token", async () => {
    let r = cont0.add({ a: "A", b: "B" })
    expect(r.get("a")).toBe("A") // Stores in cache

    let n = r.upsert({ a: 22 })
    let m: number = await n.get("a")
    expect(m).toBe(22)
  })

  it("should test if I can overwrite token without sealing", async () => {
    let r = cont0.add({ a: "A", b: "B" })
    expect(await r.get("a")).toBe("A") // Stores in cache

    let n = r.upsert({ a: 22 })
    let m: number = await n.get("a")
    expect(m).toBe(22)
  })

  it("should send containerUpdated event on overwrite", async () => {
    const cb = vi.fn()
    cont0.on("containerUpdated", (k) => {
      expect(k.key).toBe("a")
      expect(k.newContainer).toBe(22)
    })
    cont0.on("itemUpdated", (k) => {
      expect(k.key).toBe("a")
      expect(k.newItem).toBe(22)
      cb()
    })

    let r = cont0.add({ a: "A", b: "B" })
    expect(await r.get("a")).toBe("A") // Stores in cache

    let n = r.upsert({ a: 22 })
    let m: number = await n.get("a")
    expect(m).toBe(22)
    await wait(5)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it("should test if I can overwrite token and request it inside cont", async () => {
    const sub = vi.fn()
    cont0.on("containerUpdated", sub)
    let r = cont0
      .add({ a: "A" })
      .upsert((c) => {
        expect(c.a).toBe("A")
        return { a: 22 }
      })
      .add((containers) => {
        expect(containers.a).toBe(22)
        return { b: "B", c: "C" }
      })

    expect(r.get("a")).toBe(22)

    r.upsert({ a: "new A" })
    expect(r.get("a")).toBe("new A")
    expect(sub).toHaveBeenCalledTimes(2)
  }, 100)
})

describe("Node subscribeToItem", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
  })

  it("should subscribe to async container creation", async () => {
    const cb = vi.fn()
    const cont = root.add(() => ({
      a: async () => "A",
      b: async () => "B",
    }))
    cont.subscribeToItem("a", async (err, container) => {
      expect(await container).toBe("A")
      cb()
    })
    await cont.get("a")
    await wait(5)
    expect(cb).toHaveBeenCalledTimes(1)
  })
  it("should handle err on subscribes well ", async () => {
    const cont = root.add(() => ({
      a: async () => "A",
      b: async () => {
        throw "B"
      },
    }))

    cont.subscribeToItem("b", async (err, container) => {
      if (err) {
        expect(err).toBe("B")
      }
    })
    const cb = vi.fn()
    cont
      .get("b")
      .then(() => {})
      .catch((e) => {
        expect(e).toBe("B")
        cb()
      })
    await wait(5)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it("should not fire an event on a sync cont", async () => {
    const cont = root.add({
      a: async () => "A",
      b: "B",
    })
    const f1 = vi.fn()
    const f2 = vi.fn()
    cont.subscribeToItem("a", f1)

    await cont.get("a")
    cont.get("b")
    cont.subscribeToItem("b", f2)

    expect(f1).toBeCalled()
    expect(f2).not.toBeCalled()
  })

  it("should handle err on subscribeToItems", async () => {
    const cont = root
      .add(() => ({
        a: async () => "A",
        b: "B",
      }))
      .add(() => ({
        c: async () => {
          throw "C"
        },
      }))
    const f3 = vi.fn()
    cont.subscribeToItems(["a", "c"], (err, containers) => {
      if (err) {
        expect(err).toBe("C")
      }
    })
    cont.subscribeToItems((c) => [c.a, c.c], f3)

    try {
      await cont.get("c")
    } catch (e) {
      expect(e).toBe("C")
      await wait(15)
    }
  })

  it("should use containerSet to subscribe to events", async () => {
    const cont = root
      .add(() => ({
        a: async () => "A",
        b: "B",
      }))
      .add(() => ({
        c: async () => "C",
        d: "D",
      }))
    // await cont.get("a")
    const f1 = vi.fn()
    const f2 = vi.fn()
    const f3 = vi.fn()
    const f4 = vi.fn()

    cont.subscribeToItems(["a", "c"], f1)
    cont.subscribeToItems(["c", "d"], f2)
    // TODO: Warning, if called before seal, this will fail
    cont.subscribeToItems((c) => [c.a, c.c], f3)
    cont.subscribeToItems((c) => [c.c, c.d], f4)
    await cont.get("c")
    await cont.get("c")
    await cont.get("c")
    await cont.get("b")
    await cont.get("a")
    // await cont.get((c) => c.a)
    /**
     * 2 because we have subscribed to two container, and this will provide us
     * with two of those, hence two updates because two creations
     */
    expect(f1).toHaveBeenCalledTimes(2)
    // One because D is stored as a value on seal creation
    expect(f2).toHaveBeenCalledTimes(2)
    expect(f3).toHaveBeenCalledTimes(2)
    expect(f4).toHaveBeenCalledTimes(2)
  })
})

describe("Node getter", () => {
  let root: ReturnType<typeof createContainer>

  beforeEach(() => {
    root = createContainer()
  })

  it("should get nested containers", async () => {
    const cont1 = root.add({
      aCont: async () => provideAContainer(),
    })
    const cont2 = cont1.add({
      bCont: async () => provideBContainer(await cont1.get("aCont")),
    })
    const containers = cont2.items

    expect(containers).toHaveProperty("bCont")
    expect(containers.aCont).toBeInstanceOf(Promise)

    let b = await containers.bCont
    expect(b).toHaveProperty("b2")
    expect(b).toMatchSnapshot()
  })
})

describe("Node add", () => {
  let root: ReturnType<typeof createContainer>
  let cont: ReturnType<typeof mockNode>

  function mockNode() {
    return createContainer().add({
      a: "A",
      b: () => "B",
      c: async () => "C",
      d: async () => "D",
    })
  }
  beforeEach(() => {
    root = createContainer()
    cont = mockNode()
  })

  it("should be able to chain multiple conts", async () => {
    let r = root.add({ a: "A" }).add({ b: "B" }).add({ c: "C" }).add({ d: "D" })

    expect(r.get("a")).toBe("A")
    expect(r.get("c")).toBe("C")
  })

  it("should accept callback function that provides current cont", async () => {
    let r = await root
      .add({ a: "A" })
      .add({ k: "A" })
      .add((containers) => {
        expect(containers.a).toBe("A")
        return { b: "B", c: "C" }
      })
      .add((containers, cont) => {
        expect(cont.get("b")).toBe("B")
        return { f: "F", g: "G" }
      })
    expect(r.get("f")).toBe("F")
  })

  it("should be able to add cont in safe way", () => {
    let n = root.add({ a: "A", b: "B", c: "C" })

    expect(() => {
      // @ts-expect-error
      n.add({ a: "A", b: "B2" })
    }).toThrow()
  })

  it("should be able to add an async cont", async () => {
    // We need to test if typescript throws a type error here
    enum UniqueResult {
      A,
      B,
      F,
    }
    let cont = await root
      .add({
        a: UniqueResult.A,
        b: () => UniqueResult.B,
      })
      .add(() => ({
        f: async () => UniqueResult.F,
      }))

    await expect(cont.get("f")).resolves.toBe(UniqueResult.F)
    // @ts-expect-error
    let a: UniqueResult.A = await cont.get("f")
    await wait(5)
  })

  it("should handle a cont with out of order execution", async () => {
    let cont = root
      .add((c) => {
        return {
          a: () => "A",
          b: () => "B",
        }
      })
      .add((c) => {
        return {
          c: () => "C",
        }
      })
      .add((c, cont) => {
        return {
          d: () => "D",
          cd: () => cont.get("c") + "D",
        }
      })

    let r = cont.get("a") + cont.get("c") + cont.get("d")
    expect(r).toBe("ACD")
    let r2 = cont.get("b") + cont.get("cd")
    expect(r2).toBe("BCD")
  }, 100)
})

describe("Node getItems", () => {
  let root = createContainer()
  let cont = mockNode()
  function mockNode() {
    return createContainer().add({
      a: "A",
      b: () => "B",
      c: async () => "C",
      d: async () => "D",
    })
  }
  beforeEach(() => {
    root = createContainer()
    cont = mockNode()
  })

  it("should get container set based of primitive values", async () => {
    await expect(cont.getItems(["a", "b"])).resolves.toMatchObject({
      a: "A",
      b: "B",
    })
    await expect(cont.getItems((c) => [c.a, c.b])).resolves.toMatchObject({
      a: "A",
      b: "B",
    })
  })

  it("should get container set of only resolved promises", async () => {
    await expect(cont.getItems(["c", "d"])).resolves.toMatchObject({
      c: "C",
      d: "D",
    })

    await expect(cont.getItems((c) => [c.c, c.d])).resolves.toMatchObject({
      c: "C",
      d: "D",
    })
  })

  it("should get container set based literals and resolved promises", async () => {
    await expect(cont.getItems(["a", "c"])).resolves.toMatchObject({
      a: "A",
      c: "C",
    })

    await expect(cont.getItems((c) => [c.a, c.c])).resolves.toMatchObject({
      a: "A",
      c: "C",
    })
  })

  it("should get container set via callback API", async () => {
    await expect(cont.getItems((c) => [c.a, c.c])).resolves.toMatchObject({
      a: "A",
      c: "C",
    })
  }, 100)
})
