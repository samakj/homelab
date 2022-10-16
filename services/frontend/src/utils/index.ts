/** @format */

export const isClient = () => typeof window != 'undefined' && window.document;
export const isServer = () => !isClient();

export const forceUTCTimestamp = (timestamp: string): string => {
  if (!timestamp.endsWith('Z')) return timestamp + 'Z';
  return timestamp;
};

export const toLocaleISOString = (date: Date | number | string): string => {
  date = new Date(date);
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(+date - tzOffset).toISOString().slice(0, -1);
};

export const SECOND_IN_MS = 1000;
export const MINUTE_IN_MS = SECOND_IN_MS * 60;
export const HOUR_IN_MS = MINUTE_IN_MS * 60;
export const DAY_IN_MS = HOUR_IN_MS * 24;
export const WEEK_IN_MS = DAY_IN_MS * 7;
export const FORTNIGHT_IN_MS = WEEK_IN_MS * 2;
export const MONTH_IN_MS = DAY_IN_MS * 30;
export const YEAR_IN_MS = DAY_IN_MS * 365;
