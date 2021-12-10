import * as fc from 'fast-check'
import { pipe } from 'fp-ts/function'
import * as _ from '../src/Foldl'
import * as A from 'fp-ts/Array'

describe('utilities', () => {
  it('is the same as Array#length', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (strings) => {
        const actual = pipe(strings, pipe(_.length, _.fold(A.Foldable)))
        const expected = strings.length

        expect(actual).toEqual(expected)
      })
    )
  })

  it('prefilter then length is the same as Array#filter then Array#length', () => {
    const even = (n: number) => n % 2 === 0
    fc.assert(
      fc.property(fc.array(fc.nat()), (numbers) => {
        const actual = pipe(
          numbers,
          pipe(_.length, _.prefilter(even), _.fold(A.Foldable))
        )
        const expected = numbers.filter(even).length

        expect(actual).toEqual(expected)
      })
    )
  })
})
