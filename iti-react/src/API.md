For container set there where a couple of options.
I coded option 1 because it was easy.

But now I want option

```js
// Option 1
let containerSet1 = await cont.getItems(["aCont", "bCont", "cCont"])

// Option 2
let containerSet2 = await cont.getItems((c) => [c.aCont, c.bCont, c.Cont])

// Option 3
let containerSet2 = await cont.getItems(({ aCont, bCont, cCont }) => ({
  aCont,
  bCont,
  cCont,
}))

// Option 4
let c = cont.tokens
let containerSet2 = await cont.getItems([c.aCont, c.bCont, c.Cont])
```
