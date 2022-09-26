/** @format */

import { useState, useEffect } from 'react';
import { PermissionName, Permissions } from '../../types';

export const useGeolocation = () => {
  const [data, setData] = useState<
    GeolocationCoordinates & Pick<GeolocationPosition, 'timestamp'>
  >();
  const [error, setError] = useState<Pick<GeolocationPositionError, 'code' | 'message'>>();

  useEffect(() => {
    (navigator.permissions as Permissions)
      .query({ name: PermissionName.GEOLOCATION })
      .then((result) => {
        if (result.state === 'denied')
          return setError({
            message: `Permission denied.`,
            code: GeolocationPositionError.PERMISSION_DENIED,
          });
        navigator.geolocation.getCurrentPosition(
          (position) =>
            setData({
              timestamp: position.timestamp,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed,
            }),
          (error) => setError({ code: error.code, message: error.message })
        );
        navigator.geolocation.watchPosition(
          (position) =>
            setData({
              timestamp: position.timestamp,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed,
            }),
          (error) => setError({ code: error.code, message: error.message })
        );
      });
  }, [setData, setError]);

  return { data, error };
};
