/** @format */

export const mergeJson = (...jsons: Record<string | number, any>[]) => {
  const _merge = (target: Record<string | number, any>, src: Record<string | number, any>) => {
    Object.entries(src).forEach(([key, value]) => {
      if (!(key in target)) {
        target[key] = value;
        return;
      }
      if (Array.isArray(target[key])) {
        if (!Array.isArray(value)) throw new TypeError(`'${key}' value types dont match`);
        target[key] = [...target[key], ...value];
        return;
      }
      if (typeof target[key] === 'object') {
        if (typeof value !== 'object') throw new TypeError(`'${key}' value types dont match`);
        _merge(target[key], value);
        return;
      }

      throw new TypeError(`'${key}' exists in both objects`);
    });
  };

  const merged = {};

  jsons.forEach((_json) => _merge(merged, _json));

  return merged;
};
