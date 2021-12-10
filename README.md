# fp-ts-foldl

[![Test](http:&#x2F;&#x2F;&#x2F;actions&#x2F;workflows&#x2F;build.yml&#x2F;badge.svg)](http:&#x2F;&#x2F;&#x2F;actions&#x2F;workflows&#x2F;build.yml)

[API Docs]()

---

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->

- [fp-ts-foldl](#fp-ts-foldl)
  - [Install](#install)
  - [Example](#example)

<!-- AUTO-GENERATED-CONTENT:END -->

## Install

Uses `fp-ts` as a peer dependency.

```bash
yarn add fp-ts fp-ts-foldl
```

or

```bash
npm install fp-ts fp-ts-foldl
```

## Example

```ts
import * as L from "fp-ts-foldl/Foldl"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"

const average: L.Fold<number, number> = pipe(
  L.Do,
  L.apS("sum", L.sum),
  L.apS("length", L.length),
  L.map(({ sum, length }) => sum / length)
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    // Calculates the average of the range 1–20
    pipe(average, L.fold(RA.Foldable))
  ),
  10.5
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    // Calculates the average of the first three elements of the range 1–20
    pipe(average, L.take(3), L.fold(RA.Foldable))
  ),
  2
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    // Calculates the average of the first three elements of the even numbers of the range 1–20
    pipe(
      average,
      L.take(3),
      L.prefilter(x => x % 2 === 0),
      L.fold(RA.Foldable)
    )
  ),
  4
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    // Calculates the average of the even numbers of the first three elements of the range 1–20
    pipe(
      average,
      L.prefilter(x => x % 2 === 0),
      L.take(3),
      L.fold(RA.Foldable)
    )
  ),
  2
)
```
