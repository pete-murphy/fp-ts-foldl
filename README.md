# fp-ts-foldl

## Benchmarks

Comparison with builtin/native methods and using [`transducers-js`](https://github.com/cognitect-labs/transducers-js) on various list types

`map`, `filter`, `sum` on an `Array` of 1,000,000 numbers
![array4](https://user-images.githubusercontent.com/26548438/182519315-8e5093a8-25a2-4f2f-bcbb-088bc835ac19.png)

`map`, `filter`, `sum` on an [`immutable/List`](https://github.com/immutable-js/immutable-js/) of 1,000,000 numbers
![imm4](https://user-images.githubusercontent.com/26548438/182519309-410d30b7-e5f0-4a70-a540-f82f234afa00.png)

`map`, `filter`, `sum` on a [`funkia/List`](https://github.com/funkia/list) of 1,000,000 numbers
![funkia4](https://user-images.githubusercontent.com/26548438/182519313-20231c13-dbf1-4161-a0a7-23e4d17d83d5.png)


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
