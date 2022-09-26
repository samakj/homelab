/** @format */

interface AddEventListener<T extends {} = {}> {
  (type: 'start', callback: () => void): void;
  (type: 'error', callback: (error: DOMException) => void): void;
  (type: 'reading', callback: (sensor: React.UIEvent<Sensor<T>>) => void): void;
}

export enum SensorReferenceFrame {
  DEVICE = 'device',
  SCREEN = 'screen',
}
export interface SensorOptions {
  frequency?: number;
  referenceFrame?: SensorReferenceFrame;
}

export type Sensor<T extends {} = {}, O extends SensorOptions = SensorOptions> = {
  new (options?: O): Sensor<T, O>;
  activated: boolean;
  hasReading: boolean;
  timestamp: boolean;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onerror: (error: DOMException) => void;
  onreading: (sensor: React.UIEvent<Sensor<T>>) => void;
  addEventListener: AddEventListener<T>;
} & T;

export interface AccelerometerSensorData {
  x: number;
  y: number;
  z: number;
}

export interface AmbientLightSensorData {
  illuminance: number;
}

export interface GyroscopeSensorData {
  x: number;
  y: number;
  z: number;
}

export interface MagnetometerSensorData {
  x: number;
  y: number;
  z: number;
}

export interface OrientationSensorData {
  quarternion: [x: number, z: number, z: number, w: number];
}

export type AnySensorData =
  | AccelerometerSensorData
  | AmbientLightSensorData
  | GyroscopeSensorData
  | MagnetometerSensorData
  | OrientationSensorData;

export type AbsoluteOrientationSensor = Sensor<OrientationSensorData>;
export type Accelerometer = Sensor<AccelerometerSensorData>;
export type AmbientLightSensor = Sensor<AmbientLightSensorData>;
export type GravitySensor = Sensor<AccelerometerSensorData>;
export type Gyroscope = Sensor<GyroscopeSensorData>;
export type LinearAccelerationSensor = Sensor<AccelerometerSensorData>;
export type Magnetometer = Sensor<MagnetometerSensorData>;
export type OrientationSensor = Sensor<OrientationSensorData>;
export type RelativeOrientationSensor = Sensor<OrientationSensorData>;

export type AnySensor =
  | AbsoluteOrientationSensor
  | Accelerometer
  | AmbientLightSensor
  | GravitySensor
  | Gyroscope
  | LinearAccelerationSensor
  | Magnetometer
  | OrientationSensor
  | RelativeOrientationSensor;

declare global {
  var AbsoluteOrientationSensor: AbsoluteOrientationSensor | undefined;
  var Accelerometer: Accelerometer | undefined;
  var AmbientLightSensor: AmbientLightSensor | undefined;
  var GravitySensor: GravitySensor | undefined;
  var Gyroscope: Gyroscope | undefined;
  var LinearAccelerationSensor: LinearAccelerationSensor | undefined;
  var Magnetometer: Magnetometer | undefined;
  var OrientationSensor: OrientationSensor | undefined;
  var RelativeOrientationSensor: RelativeOrientationSensor | undefined;

  interface Window {
    AbsoluteOrientationSensor?: AbsoluteOrientationSensor;
    Accelerometer?: Accelerometer;
    AmbientLightSensor?: AmbientLightSensor;
    GravitySensor?: GravitySensor;
    Gyroscope?: Gyroscope;
    LinearAccelerationSensor?: LinearAccelerationSensor;
    Magnetometer?: Magnetometer;
    OrientationSensor?: OrientationSensor;
    RelativeOrientationSensor?: RelativeOrientationSensor;
  }
}
