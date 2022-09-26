/** @format */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionName, Permissions } from '../../types';
import { isClient } from '../../utils';
import {
  AccelerometerSensorData,
  AmbientLightSensorData,
  GyroscopeSensorData,
  MagnetometerSensorData,
  OrientationSensorData,
  Sensor,
  SensorOptions,
} from './types';

const useSensorGenerator =
  <T extends {} = {}, O extends SensorOptions = SensorOptions>(
    SensorClass: Sensor<T, O> | undefined,
    extractEventData: (event: React.UIEvent<Sensor<T, O>>) => T,
    permissions: PermissionName[]
  ) =>
  (options?: O) => {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<DOMException>();
    const sensor = useRef<Sensor<T, O> | null>();

    const setDataFromEvent = useCallback(
      (event: React.UIEvent<Sensor<T, O>>) => setData(extractEventData(event)),
      [setData]
    );

    useEffect(() => {
      Promise.all(
        permissions.map((permission) =>
          (navigator.permissions as Permissions).query({ name: permission })
        )
      )
        .then((results) => {
          for (const result of results)
            if (result.state === 'denied')
              throw new DOMException(`Permission denied.`, 'SecurityError');
        })
        .then(() => {
          if (SensorClass) {
            sensor.current = new SensorClass(options);
            sensor.current.onreading = setDataFromEvent;
            sensor.current.onerror = setError;
            sensor.current.start();
          } else {
            throw new DOMException('Sensor doesnt exist in window', 'DoesntExist');
          }
        })
        .catch(setError);
      return () => sensor.current?.stop();
    }, [setDataFromEvent]);

    return { data, error, instance: sensor.current };
  };

const extractAccelerometerSensorData = (
  event: React.UIEvent<Sensor<AccelerometerSensorData, any>>
): AccelerometerSensorData => ({
  x: event.currentTarget.x,
  y: event.currentTarget.y,
  z: event.currentTarget.z,
});

const extractAmbientLightSensorData = (
  event: React.UIEvent<Sensor<AmbientLightSensorData, any>>
): AmbientLightSensorData => ({ illuminance: event.currentTarget.illuminance });

const extractGyroscopeSensorData = (
  event: React.UIEvent<Sensor<GyroscopeSensorData, any>>
): GyroscopeSensorData => ({
  x: event.currentTarget.x,
  y: event.currentTarget.y,
  z: event.currentTarget.z,
});

const extractMagnetometerSensorData = (
  event: React.UIEvent<Sensor<MagnetometerSensorData, any>>
): MagnetometerSensorData => ({
  x: event.currentTarget.x,
  y: event.currentTarget.y,
  z: event.currentTarget.z,
});

const extractOrientationSensorData = (
  event: React.UIEvent<Sensor<OrientationSensorData, any>>
): OrientationSensorData => ({ quarternion: event.currentTarget.quarternion });

export const useAbsoluteOrientationSensor = useSensorGenerator(
  isClient() ? window.AbsoluteOrientationSensor : undefined,
  extractOrientationSensorData,
  [PermissionName.ACCELEROMETER, PermissionName.GYROSCOPE, PermissionName.MAGNETOMETER]
);

export const useAccelerometer = useSensorGenerator(
  isClient() ? window.Accelerometer : undefined,
  extractAccelerometerSensorData,
  [PermissionName.ACCELEROMETER]
);

export const useAmbientLightSensor = useSensorGenerator(
  isClient() ? window.AmbientLightSensor : undefined,
  extractAmbientLightSensorData,
  [PermissionName.AMBIENT_LIGHT_SENSOR]
);

export const useGravitySensor = useSensorGenerator(
  isClient() ? window.GravitySensor : undefined,
  extractAccelerometerSensorData,
  [PermissionName.ACCELEROMETER]
);

export const useGyroscope = useSensorGenerator(
  isClient() ? window.Gyroscope : undefined,
  extractGyroscopeSensorData,
  [PermissionName.GYROSCOPE]
);

export const useLinearAccelerationSensor = useSensorGenerator(
  isClient() ? window.LinearAccelerationSensor : undefined,
  extractAccelerometerSensorData,
  [PermissionName.ACCELEROMETER]
);

export const useMagnetometer = useSensorGenerator(
  isClient() ? window.Magnetometer : undefined,
  extractMagnetometerSensorData,
  [PermissionName.MAGNETOMETER]
);

export const useRelativeOrientationSensor = useSensorGenerator(
  isClient() ? window.RelativeOrientationSensor : undefined,
  extractOrientationSensorData,
  [PermissionName.ACCELEROMETER, PermissionName.GYROSCOPE]
);
