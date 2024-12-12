/** @format */

// eslint-disable-next-line
export type Any = any;
export type AnyFunction = (...args: Any) => Any;
export type AnyObject = { [key: string | number | symbol]: Any };

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
