/** @format */
import { AnyObject, Keys, Values } from '@/@types/objects';

export const ObjectKeys = <T extends AnyObject>(obj: T): Keys<T>[] => {
  return Object.keys(obj) as Keys<T>[];
};

export const ObjectEntries = <T extends AnyObject>(obj: T): [key: Keys<T>, value: Values<T>][] => {
  return Object.entries(obj) as [key: Keys<T>, value: Values<T>][];
};
