/** @format */
import { Any } from './any';

export type AnyArray = Any[];

export type Flatten<T extends AnyArray> = T[0][0][];
