/** @format */

/**
 * Returns if the string is an integer or not
 */
export const isIntegerString = (str: string) => !!str.match(/^-?\d+$/);

/**
 * Returns if the string is a positive integer or not
 */
export const isPositiveIntegerString = (str: string) => !!str.match(/^\d+$/);

/**
 * Returns if the string is a positive integer or not
 */
export const isNumberString = (str: string) => !!str.match(/^[+-]?(\d*\.)?\d+$/);
