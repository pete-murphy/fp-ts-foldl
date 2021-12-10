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
  - [fold](#fold)
  - [prefilter](#prefilter)
  - [premap](#premap)
  - [take](#take)
- [Instance operations](#instance-operations)
  - [map](#map)
  - [of](#of)
- [Instances](#instances)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Functor](#functor)
  - [Profunctor](#profunctor)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [Model](#model)
  - [Fold (type alias)](#fold-type-alias)
- [Utilities](#utilities)
  - [length](#length)
  - [sum](#sum)
- [utils](#utils)
  - [Do](#do)
  - [apS](#aps)

---

# Combinators

## fold

**Signature**

```ts
export declare function fold<F extends URIS>(F: Foldable1<F>): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
```

Added in v0.1.0

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

## take

**Signature**

```ts
export declare const take: (n: number) => <E, A>(fea: Fold<E, A>) => Fold<E, A>
```

Added in v0.1.0

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

## Fold (type alias)

**Signature**

```ts
export type Fold<E, A> = <R>(run: <X>(run: Fold_<X, E, A>) => R) => R
```

Added in v0.1.0

# Utilities

## length

**Signature**

```ts
export declare const length: Fold<unknown, number>
```

Added in v0.1.0

## sum

**Signature**

```ts
export declare const sum: Fold<number, number>
```

Added in v0.1.0

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
