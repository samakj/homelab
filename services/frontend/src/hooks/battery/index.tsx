/** @format */

import { useState, useCallback, useEffect } from 'react';
import { BatteryManager, BatteryManagerEvent } from './types';

export const useBattery = () => {
  const [battery, setBattery] =
    useState<Pick<BatteryManager, 'charging' | 'chargingTime' | 'dischargingTime' | 'level'>>();

  const setBatteryFromEvent = useCallback(
    (event: BatteryManagerEvent) =>
      setBattery({
        charging: event.currentTarget.charging,
        chargingTime: event.currentTarget.chargingTime,
        dischargingTime: event.currentTarget.dischargingTime,
        level: event.currentTarget.level,
      }),
    [setBattery]
  );

  useEffect(() => {
    navigator?.getBattery?.().then((battery) => {
      if (battery) {
        setBattery({
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
          level: battery.level,
        });

        battery.onchargingchange = setBatteryFromEvent;
        battery.onchargingtimechange = setBatteryFromEvent;
        battery.ondischargingtimechange = setBatteryFromEvent;
        battery.onlevelchange = setBatteryFromEvent;
      }
    });
  }, []);

  return battery;
};
