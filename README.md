# fp-ts-foldl

This is a WIP port of the [`foldl`](https://hackage.haskell.org/package/foldl) library in Haskell. Most of the documentation here has been adapted from the Hackage docs.

This library provides efficient left folds that you can combine using `Applicative` style.

- [💾 Install](#install)
- [📖 Tutorial](#tutorial)
- [🚀 Benchmarks](#benchmarks)

## Install

Uses `fp-ts` as a peer dependency.

```bash
yarn add fp-ts fp-ts-foldl
```

or

```bash
npm install fp-ts fp-ts-foldl
```

## Tutorial

This tutorial assumes the following imports:

```ts
import * as L from "fp-ts-foldl";
import { pipe } from "fp-ts/function";
import * as N from "fp-ts/number";
import * as RA from "fp-ts/ReadonlyArray";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as RR from "fp-ts/ReadonlyRecord";
```

A `Fold` is a representation of a left fold that preserves the fold's step function, initial accumulator, and extraction function. This allows the `Applicative` instance to assemble derived folds that traverse the container only once.

A `Fold<A, B>` processes elements of type `A` and results in a value of type `B`.

We can use the `fold` function to _apply_ a `Fold` to a `ReadonlyArray`:

```ts
L.fold(RA.Foldable)(L.sum)([1, 2, 3]); //-> 6
```

`fold` works with any type that implements `fp-ts`'s [`Foldable` type class](https://github.com/gcanti/fp-ts/blob/ed2b205db201e79f91a1125273508eb27d4b879d/src/Foldable.ts#L14-L23) (or any type that has a `reduce` function matching the method from that class), but we can use `foldArray` for the common use case where the `Foldable` instance is for `ReadonlyArray`:

```ts
L.foldArray(L.sum)([1, 2, 3]);
```

`Fold`s are `Applicative`s, so you can combine them using `Applicative` combinators:

```ts
// `average` has the inferred type `Fold<number, number>`
const average = pipe(
  L.Do,
  L.apS("sum", L.sum),
  L.apSW("length", L.length),
  L.map(({ sum, length }) => sum / length)
);

// Taking the sum, the sum of squares, ..., up to the sum of `x ** 5`
const powerSums = pipe(
  [1, 2, 3, 4, 5],
  RA.traverse(L.Applicative)(n =>
    pipe(
      L.sum,
      L.premap((x: number) => x ** n)
    )
  )
);
L.foldArray(powerSums)(RNEA.range(1, 10));
//-> [ 55, 385, 3025, 25333, 220825 ]
```

These combined folds will still traverse the array only once:

```ts
L.foldArray(average)(RNEA.range(1, 10_000_000));
//-> 5000000.5

pipe(
  RNEA.range(1, 10_000_000),
  L.foldArray(
    L.Do,
    L.apS("minimum", L.minimum(N.Ord)),
    L.apS("maximum", L.maximum(N.Ord))
  )
);
//-> { minimum: O.some(1), maximum: O.some(10_000_000) }
```

Now that we have the basics, let's look at [a dataset](https://archive.ics.uci.edu/ml/datasets/iris) of `Flower` measurements.

```ts
type Flower = {
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
  species: "setosa" | "versicolor" | "virginica";
};

const flowers = [
  {
    sepalLength: 5.1,
    sepalWidth: 3.5,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: "setosa",
  },
  {
    sepalLength: 4.9,
    sepalWidth: 3,
    petalLength: 1.4,
    petalWidth: 0.2,
    species: "setosa",
  },
  {
    sepalLength: 4.7,
    sepalWidth: 3.2,
    petalLength: 1.3,
    petalWidth: 0.2,
    species: "setosa",
  },
  // ...
];
```

We can get the mean petal-length of all flowers:

```ts
pipe(
  flowers,
  L.foldArray(
    L.mean,
    L.premap((flower: Flower) => flower.petalLength),
    L.map(n => n.toPrecision(3)) // `map` transforms the final result of the `Fold`
  )
);
//-> "3.76"
```

We can also use `prefilter` to just look at the petal-lengths of the _virginica_ species:

```ts
pipe(
  flowers,
  L.foldArray(
    L.mean,
    L.premap((flower: Flower) => flower.petalLength),
    L.prefilter(flower => flower.species === "virginica"),
    L.map(n => n.toPrecision(3))
  )
);
//-> "5.55"
```

Finally we can use `Applicative` combinators to get the standard deviation of all flower attributes, while only traversing the array once:

```ts
pipe(
  flowers,
  L.foldArray(
    L.Do,
    L.apS(
      "petalLength",
      pipe(
        L.std,
        L.premap((flower: Flower) => flower.petalLength)
      )
    ),
    L.apS(
      "petalWidth",
      pipe(
        L.std,
        L.premap(flower => flower.petalWidth)
      )
    ),
    L.apS(
      "sepalLength",
      pipe(
        L.std,
        L.premap(flower => flower.sepalLength)
      )
    ),
    L.apS(
      "sepalWidth",
      pipe(
        L.std,
        L.premap(flower => flower.sepalWidth)
      )
    ),
    L.map(RR.map(n => n.toPrecision(3)))
  )
);
//-> { petalLength: '1.76', petalWidth: '0.761', sepalLength: '0.825', sepalWidth: '0.432' }
```

## Benchmarks

`foldl` performs favorably against transducer implementations in [`ramda`](https://github.com/ramda/ramda) and [`transducers-js`](https://github.com/cognitect-labs/transducers-js) in the [following benchmarks](./benchmark)

`map`, `filter`, `sum` on an `Array` of 1,000,000 numbers
![array4 (2)](https://user-images.githubusercontent.com/26548438/182533139-3ab2d482-6d71-4f57-9775-08d57228837f.png)

`map`, `filter`, `sum` on an [`immutable/List`](https://github.com/immutable-js/immutable-js/) of 1,000,000 numbers
![imm4 (1)](https://user-images.githubusercontent.com/26548438/182533186-6ee6dec8-90a9-4599-b67c-d7ae598e4656.png)

`map`, `filter`, `sum` on a [`funkia/List`](https://github.com/funkia/list) of 1,000,000 numbers
![funkia4 (1)](https://user-images.githubusercontent.com/26548438/182533188-6672e3c9-da7f-4539-81ab-183c286615dd.png)
