/** @format */

export type NetworkInformationEvent = React.UIEvent<NetworkInformation>;

export enum NetworkInformationEffectiveType {
  SLOW_2G = 'slow-2g',
  _2G = '2g',
  _3G = '3g',
  _4G = '4g',
}

export enum NetworkInformationType {
  BLUETOOTH = 'bluetooth',
  CELLULAR = 'cellular',
  ETHERNET = 'ethernet',
  NONE = 'none',
  WIFI = 'wifi',
  WIMAX = 'wimax',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

export interface NetworkInformation {
  downlink: number;
  downlinkMax: number;
  effectiveType: NetworkInformationEffectiveType;
  rtt: number;
  saveData: boolean;
  type: NetworkInformationType;
  change: (event: NetworkInformationEvent) => void;
  addEventListener: (type: 'change', callback: (event: NetworkInformationEvent) => void) => void;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}
