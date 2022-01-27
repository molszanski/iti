For container set there where a couple of options.
I coded option 1 because it was easy.

But now I want option

```js
// Option 1
let containerSet1 = await cont.getContainerSet(["aCont", "bCont", "cCont"])

// Option 2
let containerSet2 = await cont.getContainerSet((c) => [
  c.aCont,
  c.bCont,
  c.Cont,
])

// Option 3
let containerSet2 = await cont.getContainerSet(({ aCont, bCont, cCont }) => ({
  aCont,
  bCont,
  cCont,
}))

// Option 4
let c = cont.tokens
let containerSet2 = await cont.getContainerSet([c.aCont, c.bCont, c.Cont])
```
