import * as b from 'benny'
import { pipe } from 'fp-ts/function'
import { readonlyArray as RA } from 'fp-ts'
import * as t from 'transducers-js'
import * as R from 'ramda'

import * as Funkia from 'list'
import Immutable from 'immutable'

import * as L from '../src'

const inc = (n: number) => n + 1
const isEven = (n: number) => n % 2 === 0
const sum = (a: number, b: number) => a + b

const mkNsArray = (x: number) =>
  Array(x)
    .fill(null)
    .map((_, i) => i)

const mkNsFunkiaList = (x: number) => Funkia.from(mkNsArray(x))

const mkNsImmutableList = (x: number) => Immutable.List(mkNsArray(x))

for (const n of Array(4)
  .fill(null)
  .map((_, i) => i + 3)) {
  const nsArray = mkNsArray(10 ** n)
  const nsFunkiaList = mkNsFunkiaList(10 ** n)
  const nsImmutList = mkNsImmutableList(10 ** n)

  const prettyLength = (10 ** n).toLocaleString()

  const expected = nsArray.map(inc).filter(isEven).reduce(sum)

  b.suite(
    `map-filter-sum, array of length ${prettyLength}`,
    b.add('native', () => {
      const actual = nsArray.map(inc).filter(isEven).reduce(sum)
      console.assert(actual === expected)
    }),
    b.add('ramda', () => {
      const actual = R.transduce(
        R.compose(R.map(inc), R.filter(isEven)),
        sum,
        0,
        nsArray
      )
      console.assert(actual === expected)
    }),
    b.add('foldl', () => {
      const actual = pipe(
        nsArray,
        pipe(L.sum, L.prefilter(isEven), L.premap(inc), L.fold(RA.Foldable))
      )
      console.assert(actual === expected)
    }),
    b.add('transducers', () => {
      const actual = t.transduce(
        t.comp(t.map(inc), t.filter(isEven)),
        sum,
        0,
        nsArray
      )
      console.assert(actual === expected)
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: `array-${n}` }),
    b.save({ file: `array-${n}`, format: 'chart.html' })
  )

  b.suite(
    `map-filter-sum, immutable/list of length ${prettyLength}`,
    b.add('native', () => {
      const actual = nsImmutList.map(inc).filter(isEven).reduce(sum)
      console.assert(actual === expected)
    }),
    b.add('ramda', () => {
      const actual = R.transduce(
        // @ts-ignore
        R.compose(R.map(inc), R.filter(isEven)),
        sum,
        0,
        // @ts-ignore
        nsImmutList
      )
      console.assert(actual === expected)
    }),
    b.add('foldl', () => {
      const actual = pipe(
        nsImmutList,
        pipe(
          L.sum,
          L.prefilter(isEven),
          L.premap(inc),
          L.foldFromReduce((fa, b, f) =>
            // @ts-ignore
            fa.reduce(f, b)
          )
        )
      )
      console.assert(actual === expected)
    }),
    b.add('transducers', () => {
      const actual = t.transduce(
        t.comp(t.map(inc), t.filter(isEven)),
        sum,
        0,
        nsImmutList
      )
      console.assert(actual === expected)
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: `immutable-${n}` }),
    b.save({ file: `immutable-${n}`, format: 'chart.html' })
  )

  b.suite(
    `map-filter-sum, funkia/list of length ${prettyLength}`,
    b.add('native', () => {
      const actual = Funkia.reduce(
        sum,
        0,
        Funkia.filter(isEven, Funkia.map(inc, nsFunkiaList))
      )
      console.assert(actual === expected)
    }),
    b.add('ramda', () => {
      const actual = R.transduce(
        // @ts-ignore
        R.compose(R.map(inc), R.filter(isEven)),
        sum,
        0,
        // @ts-ignore
        nsFunkiaList
      )
      console.assert(actual === expected)
    }),
    b.add('foldl', () => {
      const actual = pipe(
        // @ts-ignore
        nsFunkiaList,
        pipe(
          L.sum,
          L.prefilter(isEven),
          L.premap(inc),
          // @ts-ignore
          L.foldFromReduce((fa, b, f) => Funkia.reduce(f, b, fa))
        )
      )
      console.assert(actual === expected)
    }),
    b.add('transducers', () => {
      const actual = t.transduce(
        t.comp(t.map(inc), t.filter(isEven)),
        sum,
        0,
        nsFunkiaList
      )
      console.assert(actual === expected)
    }),
    b.cycle(),
    b.complete(),
    b.save({ file: `funkia-${n}` }),
    b.save({ file: `funkia-${n}`, format: 'chart.html' })
  )
}
