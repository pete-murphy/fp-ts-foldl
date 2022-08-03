# fp-ts-foldl

## Benchmarks

Comparison with builtin/native methods and using [`transducers-js`](https://github.com/cognitect-labs/transducers-js) on various list types

`map`, `filter`, `sum` on an `Array` of 1,000,000 numbers
![array4 (2)](https://user-images.githubusercontent.com/26548438/182533139-3ab2d482-6d71-4f57-9775-08d57228837f.png)

`map`, `filter`, `sum` on an [`immutable/List`](https://github.com/immutable-js/immutable-js/) of 1,000,000 numbers
![imm4 (1)](https://user-images.githubusercontent.com/26548438/182533186-6ee6dec8-90a9-4599-b67c-d7ae598e4656.png)

`map`, `filter`, `sum` on a [`funkia/List`](https://github.com/funkia/list) of 1,000,000 numbers
![funkia4 (1)](https://user-images.githubusercontent.com/26548438/182533188-6672e3c9-da7f-4539-81ab-183c286615dd.png)


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
