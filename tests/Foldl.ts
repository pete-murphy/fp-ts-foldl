import * as fc from "fast-check";
import { pipe } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as O from "fp-ts/Option";
import * as N from "fp-ts/number";

import * as _ from "../src/Foldl";

describe("folds", () => {
  test("length is the same as Array#length", () => {
    fc.assert(
      fc.property(fc.array(fc.string()), strings => {
        const actual = pipe(strings, _.foldArray(_.length));
        const expected = strings.length;

        expect(actual).toEqual(expected);
      })
    );
  });

  test("prefilter then length is the same as Array#filter then Array#length", () => {
    const even = (n: number) => n % 2 === 0;
    fc.assert(
      fc.property(fc.array(fc.nat()), numbers => {
        const actual = pipe(numbers, _.foldArray(_.length, _.prefilter(even)));
        const expected = numbers.filter(even).length;

        expect(actual).toEqual(expected);
      })
    );
  });

  test("head for RA.Foldable is the same as RA.head", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), numbers => {
        const actual = pipe(numbers, _.foldArray(_.head<number>()));
        const expected = RA.head(numbers);

        expect(actual).toEqual(expected);
      })
    );
  });

  test("headOrElse is the same as RA.head then O.getOrElse", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), numbers => {
        const actual = pipe(numbers, _.foldArray(_.headOrElse(() => 0)));
        const expected = pipe(
          RA.head(numbers),
          O.getOrElse(() => 0)
        );

        expect(actual).toEqual(expected);
      })
    );
  });

  test("last for RA.Foldable is the same as RA.last", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), numbers => {
        const actual = pipe(numbers, _.foldArray(_.last<number>()));
        const expected = RA.last(numbers);

        expect(actual).toEqual(expected);
      })
    );
  });

  test("lastOrElse is the same as RA.last then O.getOrElse", () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), numbers => {
        const actual = pipe(numbers, _.foldArray(_.lastOrElse(() => 0)));
        const expected = pipe(
          RA.last(numbers),
          O.getOrElse(() => 0)
        );

        expect(actual).toEqual(expected);
      })
    );
  });

  const maximumNum = _.foldArray(_.maximum(N.Ord));
  const minimumNum = _.foldArray(_.minimum(N.Ord));
  test("maximum for [1, 2, 3, 4] is O.some(4)", () => {
    const actual = maximumNum([1, 2, 3, 4]);
    expect(actual).toStrictEqual(O.some(4));
  });
  test("maximum for [4, 3, 2, 1] is O.some(4)", () => {
    const actual = maximumNum([4, 3, 2, 1]);
    expect(actual).toStrictEqual(O.some(4));
  });
  test("maximum for [] is O.none", () => {
    const actual = maximumNum([]);
    expect(actual).toStrictEqual(O.none);
  });

  test("minimum for [1, 2, 3, 4] is O.some(1)", () => {
    const actual = minimumNum([1, 2, 3, 4]);
    expect(actual).toStrictEqual(O.some(1));
  });
  test("minimum for [4, 3, 2, 1] is O.some(1)", () => {
    const actual = minimumNum([4, 3, 2, 1]);
    expect(actual).toStrictEqual(O.some(1));
  });
  test("minimum for [] is O.none", () => {
    const actual = minimumNum([]);
    expect(actual).toStrictEqual(O.none);
  });
});
