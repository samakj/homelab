/** @format */

export class ExtendedSet<T> extends Set<T> {
  forEach = (callbackfn: (value: T, index: number, set: ExtendedSet<T>) => void): void => {
    let index = 0;
    super.forEach((value) => {
      callbackfn(value, index, this);
      index += 1;
    });
  };

  map = <U>(callbackfn: (value: T, index: number, set: ExtendedSet<T>) => U): ExtendedSet<U> => {
    const set = new ExtendedSet<U>();
    this.forEach((value, index, _set) => set.add(callbackfn(value, index, _set)));
    return set;
  };

  filter = <S extends T>(
    predicate: (value: T, index: number, set: ExtendedSet<T>) => value is S
  ): ExtendedSet<S> => {
    const set = new ExtendedSet<S>();
    this.forEach((value, index, _set) => {
      if (predicate(value, index, _set)) set.add(value);
    });
    return set;
  };

  find = <S extends T>(
    predicate: (value: T, index: number, set: ExtendedSet<T>) => value is S
  ): T | undefined => {
    let index = 0;
    for (const value of this) if (predicate(value, index, this)) return value;
    return undefined;
  };

  reduce = <U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, set: ExtendedSet<T>) => U,
    initialValue: U
  ): U => {
    this.forEach(
      (value, index, _set) => (initialValue = callbackfn(initialValue, value, index, _set))
    );
    return initialValue;
  };

  sort = (compareFn?: (a: T, b: T) => number): T[] => {
    return this.toArray().sort(compareFn);
  };

  join = (separator?: string): string => {
    return this.toArray().join(separator);
  };

  toString = (): string => {
    return `{${this.toArray()}}`;
  };

  toArray = (): T[] => Array.from(this);
}
