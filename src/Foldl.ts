/** @since 0.1.0 */
import { Applicative2 } from 'fp-ts/Applicative'
import { Apply2, apS as apS_ } from 'fp-ts/Apply'
import { Comonad2 } from 'fp-ts/Comonad'
import { Extend2 } from 'fp-ts/Extend'
import { Foldable, Foldable1 } from 'fp-ts/Foldable'
import { absurd, flow, identity, pipe, tuple } from 'fp-ts/function'
import { Functor2 } from 'fp-ts/Functor'
import { HKT, Kind, URIS } from 'fp-ts/HKT'
import { Monoid } from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import { Predicate } from 'fp-ts/Predicate'
import { Profunctor2 } from 'fp-ts/Profunctor'
import Option = O.Option

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/** @internal */
interface Fold_<X, E, A> {
  readonly step: (x: X, e: E) => X
  readonly begin: X
  readonly done: (x: X) => A
}

/**
 * @since 0.1.0
 * @category Model
 */
export interface Fold<E, A> {
  <R>(run: <X>(run: Fold_<X, E, A>) => R): R
}

// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------

const _map: Applicative2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _ap: Applicative2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _promap: Profunctor2<URI>['promap'] = (fea, f, g) =>
  pipe(fea, promap(f, g))
const _extend: Extend2<URI>['extend'] = (wa, f) => pipe(wa, extend(f))

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
    fa((a) => run({ step: a.step, begin: a.begin, done: flow(a.done, f) }))

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
          x: readonly [typeof left.begin, typeof right.begin],
          a: E1 & E2
        ) => tuple(left.step(x[0], a), right.step(x[1], a))

        const begin = tuple(left.begin, right.begin)

        const done = (x: readonly [typeof left.begin, typeof right.begin]) =>
          left.done(x[0])(right.done(x[1]))

        return run({
          step,
          begin,
          done,
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
      begin: undefined as never,
      done: () => a,
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

/**
 * @since 0.3.0
 * @category Extend
 */
export const extend: <E, A, B>(
  f: (wa: Fold<E, A>) => B
) => (wa: Fold<E, A>) => Fold<E, B> = (f) => (wa) => (run) =>
  wa((b) =>
    run({
      step: b.step,
      begin: b.begin,
      done: (x) =>
        f((fold_) => fold_({ step: b.step, begin: x, done: b.done })),
    })
  )

/**
 * @since 0.3.0
 * @category Extract
 */
export const extract: <E, A>(wa: Fold<E, A>) => A = (wa) =>
  wa((run) => run.done(run.begin))

/**
 * @since 0.3.0
 * @category Instances
 */
export const Comonad: Comonad2<URI> = {
  URI,
  map: _map,
  extend: _extend,
  extract,
}

// /**
//  * @since 0.3.0
//  * @category Choice
//  */
// export const right: Choice2<URI>['right'] = (pbc) => (run) =>
//   pbc((bc) =>
//     run({
//       done: E.map(bc.done),
//       begin: E.right(bc.begin),
//       step: (ea, eb) =>
//         pipe(
//           ea,
//           E.map((a) => (b: any) => bc.step(a, b)),
//           E.ap(eb) as any
//         ),
//     })
//   )

// /**
//  * @since 0.3.0
//  * @category Choice
//  */
// export const left: Choice2<URI>['left'] = (pab) => (run) =>
//   pab((ab) =>
//     run({
//       done: E.mapLeft(ab.done),
//       begin: E.left(ab.begin),
//       step: (ea, eb) =>
//         pipe(
//           ea,
//           E.swap,
//           E.map((a) => (b: any) => ab.step(a, b)),
//           E.ap(eb) as any,
//           E.swap as any
//         ),
//     })
//   )

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Derivable from `Extend`.
 *
 * @since 0.3.0
 * @category Combinators
 */
export const duplicate: <E, A>(wa: Fold<E, A>) => Fold<E, Fold<E, A>> =
  /*#__PURE__*/
  extend(identity)

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
        begin: b.begin,
        done: b.done,
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
        begin: a.begin,
        done: a.done,
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
          acc: { readonly length: number; readonly x: typeof ea.begin },
          e: E
        ) =>
          acc.length < n
            ? { length: acc.length + 1, x: ea.step(acc.x, e) }
            : acc,
        begin: { length: 0, x: ea.begin },
        done: ({ x }) => ea.done(x),
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
  return (f) => (fa) => f((x) => x.done(F.reduce(fa, x.begin, x.step)))
}

/**
 * @since 0.3.0
 * @category Combinators
 */
export function foldFromReduce<F extends URIS>(
  reduce_: Foldable1<F>['reduce']
): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
export function foldFromReduce<F>(
  reduce_: Foldable<F>['reduce']
): <E, A>(f: Fold<E, A>) => (fa: HKT<F, E>) => A {
  return (f) => (fa) => f((x) => x.done(reduce_(fa, x.begin, x.step)))
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

/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 0.3.0
 */
export const apSW: <A, N extends string, R2, B>(
  name: Exclude<N, keyof A>,
  fb: Fold<R2, B>
) => <R1>(fa: Fold<R1, A>) => Fold<
  R1 & R2,
  { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = apS as any

// -------------------------------------------------------------------------------------
// folds
// -------------------------------------------------------------------------------------

/**
 * @since 0.3.0
 * @category Folds
 */
export const foldMap =
  <M>(M: Monoid<M>) =>
  <A, B>(to: (a: A) => M, from: (m: M) => B): Fold<A, B> =>
  (run) =>
    run({
      step: (m, a) => M.concat(m, to(a)),
      begin: M.empty,
      done: from,
    })

/**
 * @since 0.3.0
 * @category Folds
 */
export const head =
  <A>(): Fold<A, Option<A>> =>
  (run) =>
    run({
      step: (mx, a) =>
        pipe(
          mx,
          O.alt(() => O.some(a))
        ),
      begin: O.none as Option<A>,
      done: identity,
    })

/**
 * @since 0.3.0
 * @category Folds
 */
export const last =
  <A>(): Fold<A, Option<A>> =>
  (run) =>
    run({
      step: (_, a) => O.some(a),
      begin: O.none as Option<A>,
      done: identity,
    })

/**
 * @since 0.1.0
 * @category Folds
 */
export const sum: Fold<number, number> = (run) =>
  run({
    step: (x, y) => x + y,
    begin: 0,
    done: identity,
  })

/**
 * @since 0.1.0
 * @category Folds
 */
export const length: Fold<unknown, number> = (run) =>
  run({
    step: (n, _) => n + 1,
    begin: 0,
    done: identity,
  })

/**
 * @since 0.3.0
 * @category Folds
 */
export const mean: Fold<number, number> = (run) =>
  run({
    begin: [0, 0] as readonly [number, number],
    step: ([x, n], y) => {
      const n_ = n + 1
      return [x + (y - x) / n_, n_] as const
    },
    done: ([x, _]) => x,
  })

/**
 * @since 0.3.0
 * @category Folds
 */
export const variance: Fold<number, number> = (run) =>
  run({
    begin: [0, 0, 0] as readonly [number, number, number],
    step: ([n, mean, m2], x) => {
      const n_ = n + 1
      const mean_ = (n * mean + x) / (n + 1)
      const delta = x - mean
      const m2_ = m2 + (delta * delta * n) / (n + 1)
      return [n_, mean_, m2_] as const
    },
    done: ([n, _, m2]) => m2 / n,
  })

/**
 * @since 0.3.0
 * @category Folds
 */
export const std = map(Math.sqrt)(variance)
