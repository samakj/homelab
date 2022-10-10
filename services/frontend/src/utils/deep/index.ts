/** @format */

export const deepGet = <T extends unknown, D extends unknown = undefined>(
  obj: any,
  keyPath: (string | number)[],
  defaultValue: D
): T | D => {
  let value = obj?.[keyPath[0]];
  let i = 0;

  while (value !== undefined && i < keyPath.length) {
    i += 1;
    value = value?.[keyPath[i]];
  }

  return value !== undefined ? value : defaultValue;
};

export const deepSet = (obj: any, keyPath: (string | number)[], value: any): void => {
  let path = obj;
  let i = 0;

  while (i < keyPath.length - 1) path[keyPath[i]] = {};

  path[keyPath[i]] = value;
};

export const deepSetIfNullish = (obj: any, keyPath: (string | number)[], value: any): void => {
  let path = obj;
  let i = 0;

  while (i < keyPath.length - 1) {
    path = path[keyPath[i]] || {};
    i += 1;
  }

  path[keyPath[i]] = path[keyPath[i]] == null ? value : path[keyPath[i]];
};
