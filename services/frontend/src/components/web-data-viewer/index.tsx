/** @format */

import React from 'react';
import { useBattery } from '../../hooks/battery';
import { useConnection } from '../../hooks/connection';
import { useGeolocation } from '../../hooks/geolocation';
import {
  useAbsoluteOrientationSensor,
  useAccelerometer,
  useAmbientLightSensor,
  useGravitySensor,
  useGyroscope,
  useLinearAccelerationSensor,
  useMagnetometer,
  useRelativeOrientationSensor,
} from '../../hooks/sensor';
import { Button } from '../button';

export const WebDataViewer: React.FunctionComponent = () => {
  const battery = useBattery();
  const connection = useConnection();
  const { error: geolocationError, data: geolocationData } = useGeolocation();

  const { error: absoluteOrientationSensorError, data: absoluteOrientationSensorData } =
    useAbsoluteOrientationSensor({ frequency: 1 });
  const { error: accelerometerError, data: accelerometerData } = useAccelerometer({ frequency: 1 });
  const { error: ambientLightSensorError, data: ambientLightSensorData } = useAmbientLightSensor({
    frequency: 1,
  });
  const { error: gravitySensorError, data: gravitySensorData } = useGravitySensor({ frequency: 1 });
  const { error: gyroscopeError, data: gyroscopeData } = useGyroscope({ frequency: 1 });
  const { error: linearAccelerationSensorError, data: linearAccelerationSensorData } =
    useLinearAccelerationSensor({ frequency: 1 });
  const { error: magnetometerError, data: magnetometerData } = useMagnetometer({ frequency: 1 });
  const { error: relativeOrientationSensorError, data: relativeOrientationSensorData } =
    useRelativeOrientationSensor({ frequency: 1 });

  return (
    <div>
      <div>
        <div>Battery API</div>
        <pre>{JSON.stringify(battery, null, 4)}</pre>
      </div>
      <div>
        <div>Connection API</div>
        <pre>{JSON.stringify(connection, null, 4)}</pre>
      </div>
      <div>
        <div>Geolocation API</div>
        <pre>{JSON.stringify(geolocationData || geolocationError, null, 4)}</pre>
      </div>
      <div>
        <div>Vibrate API</div>
        <div>
          <Button onClick={() => navigator.vibrate(200)}>Vibrate</Button>
        </div>
      </div>
      <div>
        <div>Absolute Orientation Sensor API</div>
        <pre>
          {JSON.stringify(
            absoluteOrientationSensorData || absoluteOrientationSensorError?.message,
            null,
            4
          )}
        </pre>
      </div>
      <div>
        <div>Accelerometer API</div>
        <pre>{JSON.stringify(accelerometerData || accelerometerError?.message, null, 4)}</pre>
      </div>
      <div>
        <div>Ambient Light Sensor API</div>
        <pre>
          {JSON.stringify(ambientLightSensorData || ambientLightSensorError?.message, null, 4)}
        </pre>
      </div>
      <div>
        <div>Gravity Sensor API</div>
        <pre>{JSON.stringify(gravitySensorData || gravitySensorError?.message, null, 4)}</pre>
      </div>
      <div>
        <div>Gyroscope API</div>
        <pre>{JSON.stringify(gyroscopeData || gyroscopeError?.message, null, 4)}</pre>
      </div>
      <div>
        <div>Linear Acceleration Sensor API</div>
        <pre>
          {JSON.stringify(
            linearAccelerationSensorData || linearAccelerationSensorError?.message,
            null,
            4
          )}
        </pre>
      </div>
      <div>
        <div>Magnetometer API</div>
        <pre>{JSON.stringify(magnetometerData || magnetometerError?.message, null, 4)}</pre>
      </div>
      <div>
        <div>Relative Orientation Sensor API</div>
        <pre>
          {JSON.stringify(
            relativeOrientationSensorData || relativeOrientationSensorError?.message,
            null,
            4
          )}
        </pre>
      </div>
    </div>
  );
};
