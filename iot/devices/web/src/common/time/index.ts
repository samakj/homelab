/** @format */

export const SECOND_IN_MS = 1000;
export const MINUTE_IN_MS = 60 * SECOND_IN_MS;
export const HOUR_IN_MS = 60 * MINUTE_IN_MS;
export const DAY_IN_MS = 24 * HOUR_IN_MS;

export const formatTimeDelta = (delta: number) => {
  let _delta = delta;
  const days = Math.floor(_delta / DAY_IN_MS);
  _delta -= days * DAY_IN_MS;
  const hours = Math.floor(_delta / HOUR_IN_MS);
  _delta -= hours * HOUR_IN_MS;
  const minutes = Math.floor(_delta / MINUTE_IN_MS);
  _delta -= minutes * MINUTE_IN_MS;
  const seconds = Math.floor(_delta / SECOND_IN_MS);
  _delta -= seconds * SECOND_IN_MS;

  if (days) {
    return `${days}d${hours ? ` ${hours}h` : ''}`;
  } else if (hours) {
    return `${hours}h${minutes ? ` ${minutes}m` : ''}`;
  } else if (minutes) {
    return `${minutes}m${seconds ? ` ${seconds}s` : ''}`;
  }

  return `${seconds}s`;
};
