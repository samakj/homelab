/** @format */
import { Any } from './any';

export type UnionToIntersection<Union> = (Union extends Any ? (k: Union) => void : never) extends (
  k: infer Intersection
) => void
  ? Intersection
  : never;
