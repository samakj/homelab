/** @format */

export type NullSafeMerge<A extends {} | null, B extends {} | null> = A extends null
  ? B extends null
    ? null
    : B
  : A;
