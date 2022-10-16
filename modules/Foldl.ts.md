---
title: Foldl.ts
nav_order: 1
parent: Modules
---

## Foldl overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [Combinators](#combinators)
  - [duplicate](#duplicate)
  - [fold](#fold)
  - [foldFromReduce](#foldfromreduce)
  - [prefilter](#prefilter)
  - [premap](#premap)
  - [struct](#struct)
  - [take](#take)
- [Extend](#extend)
  - [extend](#extend)
- [Extract](#extract)
  - [extract](#extract)
- [Folds](#folds)
  - [foldMap](#foldmap)
  - [head](#head)
  - [headOrElse](#headorelse)
  - [last](#last)
  - [lastOrElse](#lastorelse)
  - [length](#length)
  - [maximum](#maximum)
  - [mean](#mean)
  - [minimum](#minimum)
  - [std](#std)
  - [sum](#sum)
  - [variance](#variance)
- [Instance operations](#instance-operations)
  - [map](#map)
  - [of](#of)
- [Instances](#instances)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Comonad](#comonad)
  - [Functor](#functor)
  - [Profunctor](#profunctor)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [Model](#model)
  - [Fold (interface)](#fold-interface)
- [Utilities](#utilities)
  - [foldArray](#foldarray)
- [utils](#utils)
  - [Do](#do)
  - [apS](#aps)
  - [apSW](#apsw)

---

# Combinators

## duplicate

Derivable from `Extend`.

**Signature**

```ts
export declare const duplicate: <E, A>(wa: Fold<E, A>) => Fold<E, Fold<E, A>>
```

Added in v0.3.0

## fold

**Signature**

```ts
export declare function fold<F extends URIS>(F: Foldable1<F>): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
```

Added in v0.1.0

## foldFromReduce

**Signature**

```ts
export declare function foldFromReduce<F extends URIS>(
  reduce_: Foldable1<F>['reduce']
): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
```

Added in v0.3.0

## prefilter

**Signature**

```ts
export declare const prefilter: <A>(predicate: Predicate<A>) => <R>(fold_: Fold<A, R>) => Fold<A, R>
```

Added in v0.1.0

## premap

**Signature**

```ts
export declare const premap: <A, B>(f: (a: A) => B) => <R>(fold_: Fold<B, R>) => Fold<A, R>
```

Added in v0.1.0

## struct

**Signature**

```ts
export declare const struct: <E, NER>(
  r: (keyof NER extends never ? never : NER) & Record<string, Fold<E, any>>
) => Fold<E, { [K in keyof NER]: [NER[K]] extends [Fold<any, infer A>] ? A : never }>
```

Added in v0.3.9

## take

**Signature**

```ts
export declare const take: (n: number) => <E, A>(fea: Fold<E, A>) => Fold<E, A>
```

Added in v0.1.0

# Extend

## extend

**Signature**

```ts
export declare const extend: <E, A, B>(f: (wa: Fold<E, A>) => B) => (wa: Fold<E, A>) => Fold<E, B>
```

Added in v0.3.0

# Extract

## extract

**Signature**

```ts
export declare const extract: <E, A>(wa: Fold<E, A>) => A
```

Added in v0.3.0

# Folds

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A, B>(to: (a: A) => M, from: (m: M) => B) => Fold<A, B>
```

Added in v0.3.0

## head

**Signature**

```ts
export declare const head: <A>() => Fold<A, O.Option<A>>
```

Added in v0.3.0

## headOrElse

**Signature**

```ts
export declare const headOrElse: <A>(onEmpty: Lazy<A>) => Fold<A, A>
```

Added in v0.3.8

## last

**Signature**

```ts
export declare const last: <A>() => Fold<A, O.Option<A>>
```

Added in v0.3.0

## lastOrElse

**Signature**

```ts
export declare const lastOrElse: <A>(onEmpty: Lazy<A>) => Fold<A, A>
```

Added in v0.3.8

## length

**Signature**

```ts
export declare const length: Fold<unknown, number>
```

Added in v0.1.0

## maximum

**Signature**

```ts
export declare const maximum: <A>(OrdA: Ord.Ord<A>) => Fold<A, O.Option<A>>
```

Added in v0.3.5

## mean

**Signature**

```ts
export declare const mean: Fold<number, number>
```

Added in v0.3.0

## minimum

**Signature**

```ts
export declare const minimum: <A>(OrdA: Ord.Ord<A>) => Fold<A, O.Option<A>>
```

Added in v0.3.5

## std

**Signature**

```ts
export declare const std: Fold<number, number>
```

Added in v0.3.0

## sum

**Signature**

```ts
export declare const sum: Fold<number, number>
```

Added in v0.1.0

## variance

**Signature**

```ts
export declare const variance: Fold<number, number>
```

Added in v0.3.0

# Instance operations

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Fold<E, A>) => Fold<E, B>
```

Added in v0.1.0

## of

**Signature**

```ts
export declare const of: <E = never, A = never>(a: A) => Fold<E, A>
```

Added in v0.1.0

# Instances

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative2<'Fold'>
```

Added in v0.1.0

## Apply

**Signature**

```ts
export declare const Apply: Apply2<'Fold'>
```

Added in v0.1.0

## Comonad

**Signature**

```ts
export declare const Comonad: Comonad2<'Fold'>
```

Added in v0.3.0

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'Fold'>
```

Added in v0.1.0

## Profunctor

**Signature**

```ts
export declare const Profunctor: Profunctor2<'Fold'>
```

Added in v0.1.0

## URI

**Signature**

```ts
export declare const URI: 'Fold'
```

Added in v0.1.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

# Model

## Fold (interface)

**Signature**

```ts
export interface Fold<E, A> {
  <R>(run: <X>(run: Fold_<X, E, A>) => R): R
}
```

Added in v0.1.0

# Utilities

## foldArray

**Signature**

```ts
export declare function foldArray<A, Out>(a: Fold<A, Out>): (_: ReadonlyArray<A>) => Out
export declare function foldArray<A, A_, B, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, Out>
): (_: ReadonlyArray<B>) => Out
export declare function foldArray<A, A_, B, B_, C, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, B_>,
  bc: (b: Fold<B, B_>) => Fold<C, Out>
): (_: ReadonlyArray<C>) => Out
export declare function foldArray<A, A_, B, B_, C, C_, D, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, B_>,
  bc: (b: Fold<B, B_>) => Fold<C, C_>,
  cd: (c: Fold<C, C_>) => Fold<D, Out>
): (_: ReadonlyArray<D>) => Out
export declare function foldArray<A, A_, B, B_, C, C_, D, D_, E, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, B_>,
  bc: (b: Fold<B, B_>) => Fold<C, C_>,
  cd: (c: Fold<C, C_>) => Fold<D, D_>,
  de: (d: Fold<D, D_>) => Fold<E, Out>
): (_: ReadonlyArray<E>) => Out
export declare function foldArray<A, A_, B, B_, C, C_, D, D_, E, E_, F, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, B_>,
  bc: (b: Fold<B, B_>) => Fold<C, C_>,
  cd: (c: Fold<C, C_>) => Fold<D, D_>,
  de: (d: Fold<D, D_>) => Fold<E, E_>,
  ef: (e: Fold<E, E_>) => Fold<F, Out>
): (_: ReadonlyArray<F>) => Out
export declare function foldArray<A, A_, B, B_, C, C_, D, D_, E, E_, F, F_, G, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, B_>,
  bc: (b: Fold<B, B_>) => Fold<C, C_>,
  cd: (c: Fold<C, C_>) => Fold<D, D_>,
  de: (d: Fold<D, D_>) => Fold<E, E_>,
  ef: (e: Fold<E, E_>) => Fold<F, F_>,
  fg: (f: Fold<F, F_>) => Fold<G, Out>
): (_: ReadonlyArray<G>) => Out
export declare function foldArray<A, A_, B, B_, C, C_, D, D_, E, E_, F, F_, G, G_, H, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, B_>,
  bc: (b: Fold<B, B_>) => Fold<C, C_>,
  cd: (c: Fold<C, C_>) => Fold<D, D_>,
  de: (d: Fold<D, D_>) => Fold<E, E_>,
  ef: (e: Fold<E, E_>) => Fold<F, F_>,
  fg: (f: Fold<F, F_>) => Fold<G, G_>,
  gh: (f: Fold<G, G_>) => Fold<H, Out>
): (_: ReadonlyArray<H>) => Out
export declare function foldArray<A, A_, B, B_, C, C_, D, D_, E, E_, F, F_, G, G_, H, H_, I, Out>(
  a: Fold<A, A_>,
  ab: (a: Fold<A, A_>) => Fold<B, B_>,
  bc: (b: Fold<B, B_>) => Fold<C, C_>,
  cd: (c: Fold<C, C_>) => Fold<D, D_>,
  de: (d: Fold<D, D_>) => Fold<E, E_>,
  ef: (e: Fold<E, E_>) => Fold<F, F_>,
  fg: (f: Fold<F, F_>) => Fold<G, G_>,
  gh: (f: Fold<G, G_>) => Fold<H, H_>,
  hi: (f: Fold<H, H_>) => Fold<I, Out>
): (_: ReadonlyArray<H>) => Out
```

Added in v0.3.2

# utils

## Do

**Signature**

```ts
export declare const Do: Fold<unknown, {}>
```

Added in v0.1.0

## apS

**Signature**

```ts
export declare const apS: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: Fold<E, B>
) => (fa: Fold<E, A>) => Fold<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.1.0

## apSW

Less strict version of [`apS`](#aps).

The `W` suffix (short for **W**idening) means that the error types will be merged.

**Signature**

```ts
export declare const apSW: <A, N extends string, R2, B>(
  name: Exclude<N, keyof A>,
  fb: Fold<R2, B>
) => <R1>(fa: Fold<R1, A>) => Fold<R1 & R2, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.3.0
