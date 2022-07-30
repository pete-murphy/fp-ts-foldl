/** @since 0.1.0 */
import { Applicative2 } from 'fp-ts/Applicative'
import { Apply2, apS as apS_ } from 'fp-ts/Apply'
import { Foldable, Foldable1 } from 'fp-ts/Foldable'
import { absurd, flow, identity, pipe, tuple } from 'fp-ts/function'
import { Functor2 } from 'fp-ts/Functor'
import { Profunctor2 } from 'fp-ts/Profunctor'
import { Predicate } from 'fp-ts/Predicate'
import { HKT, Kind, URIS } from 'fp-ts/HKT'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/** @internal */
type Fold_<X, E, A> = {
  readonly step: (x: X, e: E) => X
  readonly initial: X
  readonly extract: (x: X) => A
}

/**
 * @since 0.1.0
 * @category Model
 */
export type Fold<E, A> = <R>(run: <X>(run: Fold_<X, E, A>) => R) => R

// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------

const _map: Applicative2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _ap: Applicative2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _promap: Profunctor2<URI>['promap'] = (fea, f, g) =>
  pipe(fea, promap(f, g))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Instances
 */
export const URI = 'Fold'

/**
 * @since 0.1.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Fold<E, A>
  }
}

/**
 * @since 0.1.0
 * @category Instance operations
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(fa: Fold<E, A>): Fold<E, B> =>
  (run) =>
    fa((a) =>
      run({ step: a.step, initial: a.initial, extract: flow(a.extract, f) })
    )

/**
 * @since 0.1.0
 * @category Instances
 */
export const Functor: Functor2<URI> = {
  URI,
  map: _map,
}

/**
 * Less strict version of [`ap`](#ap).
 *
 * @since 0.1.0
 * @category Instance operations
 */
const apW =
  <E1 = never, E2 = never, A = never, B = never>(fa: Fold<E1, A>) =>
  (fab: Fold<E2, (a: A) => B>): Fold<E1 & E2, B> =>
  (run) =>
    fab((left) =>
      fa((right) => {
        const step = (
          x: readonly [typeof left.initial, typeof right.initial],
          a: E1 & E2
        ) => tuple(left.step(x[0], a), right.step(x[1], a))

        const initial = tuple(left.initial, right.initial)

        const extract = (
          x: readonly [typeof left.initial, typeof right.initial]
        ) => left.extract(x[0])(right.extract(x[1]))

        return run({
          step,
          initial,
          extract,
        })
      })
    )

/**
 * @since 0.1.0
 * @category Instance operations
 */
const ap: <E = never, A = never, B = never>(
  fa: Fold<E, A>
) => (fab: Fold<E, (a: A) => B>) => Fold<E, B> = apW

/**
 * @since 0.1.0
 * @category Instances
 */
export const Apply: Apply2<URI> = {
  URI,
  map: _map,
  ap: _ap,
}

/**
 * @since 0.1.0
 * @category Instance operations
 */
export const of =
  <E = never, A = never>(a: A): Fold<E, A> =>
  (run) =>
    run<never>({
      step: absurd,
      initial: undefined as never,
      extract: () => a,
    })

/**
 * @since 0.1.0
 * @category Instances
 */
export const Applicative: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
}

/**
 * @since 0.1.0
 * @category Instance operations
 */
const promap =
  <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) =>
  (fea: Fold<E, A>): Fold<D, B> =>
    pipe(_map(fea, g), premap(f))

/**
 * @since 0.1.0
 * @category Instances
 */
export const Profunctor: Profunctor2<URI> = {
  URI,
  map: _map,
  promap: _promap,
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Combinators
 */
export const premap =
  <A, B>(f: (a: A) => B) =>
  <R>(fold_: Fold<B, R>): Fold<A, R> =>
  (run) =>
    fold_((b) =>
      run({
        step: (x, y) => b.step(x, f(y)),
        initial: b.initial,
        extract: b.extract,
      })
    )

/**
 * @since 0.1.0
 * @category Combinators
 */
export const prefilter =
  <A>(predicate: Predicate<A>) =>
  <R>(fold_: Fold<A, R>): Fold<A, R> =>
  (run) =>
    fold_((a) =>
      run({
        step: (x, y) => (predicate(y) ? a.step(x, y) : x),
        initial: a.initial,
        extract: a.extract,
      })
    )

/**
 * @since 0.1.0
 * @category Combinators
 */
export const take =
  (n: number) =>
  <E, A>(fea: Fold<E, A>): Fold<E, A> =>
  (run) =>
    fea((ea) =>
      run({
        step: (
          acc: { readonly length: number; readonly x: typeof ea.initial },
          e: E
        ) =>
          acc.length < n
            ? { length: acc.length + 1, x: ea.step(acc.x, e) }
            : acc,
        initial: { length: 0, x: ea.initial },
        extract: ({ x }) => ea.extract(x),
      })
    )

/**
 * @since 0.1.0
 * @category Combinators
 */
export function fold<F extends URIS>(
  F: Foldable1<F>
): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
export function fold<F>(
  F: Foldable<F>
): <E, A>(f: Fold<E, A>) => (fa: HKT<F, E>) => A {
  return (f) => (fa) => f((x) => x.extract(F.reduce(fa, x.initial, x.step)))
}

/**
 * @since 0.1.0
 * @category Combinators
 */
export function reduce<F extends URIS>(
  reduce_: Foldable1<F>['reduce']
): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
export function reduce<F>(
  reduce_: Foldable<F>['reduce']
): <E, A>(f: Fold<E, A>) => (fa: HKT<F, E>) => A {
  return (f) => (fa) => f((x) => x.extract(reduce_(fa, x.initial, x.step)))
}

// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------

/** @since 0.1.0 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const Do: Fold<unknown, {}> =
  /*#__PURE__*/
  of({})

/** @since 0.1.0 */
export const apS = apS_(Apply)

// -------------------------------------------------------------------------------------
// utilities
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Utilities
 */
export const sum: Fold<number, number> = (run) =>
  run({
    step: (x, y) => x + y,
    initial: 0,
    extract: identity,
  })

/**
 * @since 0.1.0
 * @category Utilities
 */
export const length: Fold<unknown, number> = (run) =>
  run({
    step: (n, _) => n + 1,
    initial: 0,
    extract: identity,
  })
