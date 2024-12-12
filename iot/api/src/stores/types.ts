/** @format */
import { AnyArray } from '../@types/arrays';
import { AnyObject, Values } from '../@types/objects';
import { KeyOperatorType } from '../@types/params';

export type FiltersType<T extends AnyObject = AnyObject> = Values<{
  [K in keyof T]: K extends string
    ? {
        name: K;
        value: T[K] extends AnyArray ? T[K] : NonNullable<T[K]>[];
        operator: KeyOperatorType<T, K>;
      }
    : never;
}>[];
