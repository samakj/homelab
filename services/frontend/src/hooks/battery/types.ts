/** @format */

export type BatteryManagerEvent = React.UIEvent<BatteryManager>;

interface AddEventListener {
  (type: 'chargingchange', event: BatteryManagerEvent): void;
  (type: 'chargingtimechange', event: BatteryManagerEvent): void;
  (type: 'dischargingtimechange', event: BatteryManagerEvent): void;
  (type: 'levelchange', event: BatteryManagerEvent): void;
}

export interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: (event: BatteryManagerEvent) => void;
  onchargingtimechange: (event: BatteryManagerEvent) => void;
  ondischargingtimechange: (event: BatteryManagerEvent) => void;
  onlevelchange: (event: BatteryManagerEvent) => void;
  addEventListener: AddEventListener;
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}
