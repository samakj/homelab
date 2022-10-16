/** @format */

export type NullSafeMerge<A extends {} | null, B extends {} | null> = A extends null
  ? B
  : B extends null
  ? A
  : A & B;

export type DateLike = Date | number | string | { valueOf: () => number };

export enum PermissionName {
  ACCELEROMETER = 'accelerometer',
  ACCESSIBILITY_EVENTS = 'accessibility-events',
  AMBIENT_LIGHT_SENSOR = 'ambient-light-sensor',
  BACKGROUND_SYNC = 'background-sync',
  CAMERA = 'camera',
  CLIPBOARD_READ = 'clipboard-read',
  CLIPBOARD_WRITE = 'clipboard-write',
  GEOLOCATION = 'geolocation',
  GYROSCOPE = 'gyroscope',
  MAGNETOMETER = 'magnetometer',
  MICROPHONE = 'microphone',
  MIDI = 'midi',
  NOTIFICATIONS = 'notifications',
  PAYMENT_HANDLER = 'payment-handler',
  PERSISTENT_STORAGE = 'persistent-storage',
  PUSH = 'push',
  SCREEN_WAKE_LOCK = 'screen-wake-lock',
  XR_SPACIAL_TRACKING = 'xr-spatial-tracking',
}

export interface PermissionDescriptor {
  name: PermissionName;
}

export interface Permissions {
  new (): Permissions;
  query(permissionDesc: PermissionDescriptor): Promise<PermissionStatus>;
}
