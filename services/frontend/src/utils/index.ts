/** @format */

export const isClient = () => typeof window != 'undefined' && window.document;
export const isServer = () => !isClient();

export const forceUTCTimestamp = (timestamp: string): string => {
  if (!timestamp.endsWith('Z')) return timestamp + 'Z';
  return timestamp;
};
