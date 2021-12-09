/** @since 1.0.0 */
import { Applicative2 } from 'fp-ts/Applicative'
import { Apply2 } from 'fp-ts/Apply'
import { Foldable, Foldable1 } from 'fp-ts/Foldable'
import { flow, pipe, tuple } from 'fp-ts/function'
import { Functor2 } from 'fp-ts/Functor'
import { apS as apS_ } from 'fp-ts/Apply'
import { Profunctor2 } from 'fp-ts/Profunctor'
import { Predicate } from 'fp-ts/Predicate'
import { HKT, Kind, URIS } from 'fp-ts/HKT'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/** @internal */
type Fold_<X, E, A> = {
  readonly step: (x: X, e: E) => X
  readonly init: X
  readonly done: (x: X) => A
}

/**
 * @since 1.0.0
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
 * @since 1.0.0
 * @category Instances
 */
export const URI = 'Fold'

/**
 * @since 1.0.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Fold<E, A>
  }
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(fa: Fold<E, A>): Fold<E, B> =>
  (run) =>
    fa((a) => run({ step: a.step, init: a.init, done: flow(a.done, f) }))

/**
 * @since 1.0.0
 * @category Instances
 */
export const Functor: Functor2<URI> = {
  URI,
  map: _map,
}

/**
 * Less strict version of [`ap`](#ap).
 *
 * @since 1.0.0
 * @category Instance operations
 */
const apW =
  <E1 = never, E2 = never, A = never, B = never>(fa: Fold<E1, A>) =>
  (fab: Fold<E2, (a: A) => B>): Fold<E1 & E2, B> =>
  (run) =>
    fab(({ step: stepL, init: initL, done: doneL }) =>
      fa(({ step: stepR, init: initR, done: doneR }) => {
        const step = (
          [xL, xR]: readonly [typeof initL, typeof initR],
          a: E1 & E2
        ) => tuple(stepL(xL, a), stepR(xR, a))
        const init = tuple(initL, initR)
        const done = ([xL, xR]: readonly [typeof initL, typeof initR]) =>
          doneL(xL)(doneR(xR))
        return run({
          step,
          init,
          done,
        })
      })
    )

/**
 * @since 1.0.0
 * @category Instance operations
 */
const ap: <E = never, A = never, B = never>(
  fa: Fold<E, A>
) => (fab: Fold<E, (a: A) => B>) => Fold<E, B> = apW

/**
 * @since 1.0.0
 * @category Instances
 */
export const Apply: Apply2<URI> = {
  URI,
  map: _map,
  ap: _ap,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
export const of =
  <E = never, A = never>(a: A): Fold<E, A> =>
  (run) =>
    run<undefined>({
      step: () => undefined,
      init: undefined,
      done: () => a,
    })

/**
 * @since 1.0.0
 * @category Instances
 */
export const Applicative: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
}

/**
 * @since 1.0.0
 * @category Instance operations
 */
const promap =
  <E, A, D, B>(f: (d: D) => E, g: (a: A) => B) =>
  (fea: Fold<E, A>): Fold<D, B> =>
    pipe(_map(fea, g), premap(f))

/**
 * @since 1.0.0
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
 * @since 1.0.0
 * @category Combinators
 */
export const premap =
  <A, B>(f: (a: A) => B) =>
  <R>(fld: Fold<B, R>): Fold<A, R> =>
  (run) =>
    fld((b) =>
      run({
        step: (x, y) => b.step(x, f(y)),
        init: b.init,
        done: b.done,
      })
    )

/**
 * @since 1.0.0
 * @category Combinators
 */
export const prefilter =
  <A>(pred: Predicate<A>) =>
  <R>(fld: Fold<A, R>): Fold<A, R> =>
  (run) =>
    fld((a) =>
      run({
        step: (x, y) => (pred(y) ? a.step(x, y) : x),
        init: a.init,
        done: a.done,
      })
    )

/**
 * @since 1.0.0
 * @category Combinators
 */
export const take =
  (n: number) =>
  <E, A>(fea: Fold<E, A>): Fold<E, A> =>
  (run) =>
    fea((ea) =>
      run({
        step: (
          acc: { readonly length: number; readonly x: typeof ea.init },
          e: E
        ) =>
          acc.length < n
            ? { length: acc.length + 1, x: ea.step(acc.x, e) }
            : acc,
        init: { length: 0, x: ea.init },
        done: ({ x }) => ea.done(x),
      })
    )

/**
 * @since 1.0.0
 * @category Combinators
 */
export function fold<F extends URIS>(
  F: Foldable1<F>
): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
export function fold<F>(
  F: Foldable<F>
): <E, A>(f: Fold<E, A>) => (fa: HKT<F, E>) => A {
  return (f) => (fa) => f((x) => x.done(F.reduce(fa, x.init, x.step)))
}

// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------

/** @since 1.0.0 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const Do: Fold<unknown, {}> =
  /*#__PURE__*/
  of({})

/** @since 1.0.0 */
export const apS = apS_(Apply)
