/** @format */

export type NullSafeMerge<A extends {} | null, B extends {} | null> = A extends null
  ? B
  : B extends null
  ? A
  : A & B;
