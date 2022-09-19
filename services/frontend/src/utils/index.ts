/** @format */

export const isClient = () => typeof window != 'undefined' && window.document;
export const isServer = () => !isClient();
