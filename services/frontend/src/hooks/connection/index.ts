/** @format */

import { useState, useCallback, useEffect } from 'react';
import { NetworkInformation, NetworkInformationEvent } from './types';

export const useConnection = () => {
  const [connection, setConnection] =
    useState<
      Pick<
        NetworkInformation,
        'downlink' | 'downlinkMax' | 'effectiveType' | 'rtt' | 'saveData' | 'type'
      >
    >();

  const setConnectionFromEvent = useCallback(
    (event: NetworkInformationEvent) =>
      setConnection({
        downlink: event.currentTarget.downlink,
        downlinkMax: event.currentTarget.downlinkMax,
        effectiveType: event.currentTarget.effectiveType,
        rtt: event.currentTarget.rtt,
        saveData: event.currentTarget.saveData,
        type: event.currentTarget.type,
      }),
    [setConnection]
  );

  useEffect(() => {
    if (navigator.connection) {
      setConnection({
        downlink: navigator.connection.downlink,
        downlinkMax: navigator.connection.downlinkMax,
        effectiveType: navigator.connection.effectiveType,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
        type: navigator.connection.type,
      }),
        (navigator.connection.change = setConnectionFromEvent);
    }
  }, [setConnection]);

  return connection;
};
