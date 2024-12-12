/** @format */
import { Any } from './any';

export type AnyObject = Partial<{
  [key: string]: Any;
  [key: number]: Any;
}>;

export type EmptyObject = {};

export type Keys<Obj> = Obj extends AnyObject ? keyof Obj : never;

export type Values<Obj> = Obj extends AnyObject ? Obj[keyof Obj] : never;

export type NullableKeys<T, K extends keyof T = keyof T> = K extends unknown
  ? undefined extends T[K]
    ? K
    : never
  : never;

export type NonNullableKeys<T, K extends keyof T = keyof T> = K extends unknown
  ? undefined extends T[K]
    ? never
    : K
  : never;
