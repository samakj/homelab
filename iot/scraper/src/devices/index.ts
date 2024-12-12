/** @format */
import { getDeviceEmoji } from '@/common/emojis';
import { getRouterDevices } from '@/router';
import { ServerType } from '@/server';

import { ScrapedDevicesType } from './types';
import { DeviceWebsocket } from './websocket';

export const scrapeDevices = async (server: ServerType) => {
  await getRouterDevices(server);
  const devices: ScrapedDevicesType = {};

  // console.log(
  //   `[device] Checking ${Object.keys(server.localStorage.routerConnectedDevices).length} router devices for \`/devices\` endpoint`
  // );
  await Promise.all(
    Object.values(server.localStorage.routerConnectedDevices).map(async (device) => {
      if (server.localStorage.routerDevices[device.mac]) {
        const response = await fetch(
          `http://${server.localStorage.routerDevices[device.mac].ip}/device`
        )
          .then((response) => response.json())
          .catch(() => null);
        if (response?.mac) {
          devices[response.mac] = { ...device, ...response };
        }
      }
    })
  );

  const newDevices: ScrapedDevicesType = {};
  const updatedDevices: ScrapedDevicesType = {};
  const removedDevices: ScrapedDevicesType = {};

  Object.values(devices).forEach((device) => {
    if (!server.localStorage.scrapedDevices[device.mac]) {
      newDevices[device.mac] = device;
    } else if (device.ip != server.localStorage.scrapedDevices[device.mac].ip) {
      updatedDevices[device.mac] = device;
    }
  });
  Object.values(server.localStorage.scrapedDevices).forEach((device) => {
    if (!devices[device.mac]) {
      removedDevices[device.mac] = device;
    }
  });

  if (Object.keys(newDevices).length) {
    console.log(`[device] ${Object.keys(newDevices).length} new iot devices found.`);
    Object.values(newDevices).forEach((device) => {
      console.log(`[device] ${device.ip} ${getDeviceEmoji(device.ip)}: Creating websocket`);
      server.localStorage.deviceWebsockets[device.mac] = new DeviceWebsocket(
        server,
        device.mac,
        device.ip
      );
      server.localStorage.deviceWebsockets[device.mac].connectReportsSocket();
    });
  }
  if (Object.keys(updatedDevices).length) {
    console.log(`[device] ${Object.keys(updatedDevices).length} updated iot devices found`);
    Object.values(updatedDevices).forEach((device) => {
      console.log(`[device] ${device.ip} ${getDeviceEmoji(device.ip)}: Re-creating websocket`);
      server.localStorage.deviceWebsockets[device.mac]?.close();
      server.localStorage.deviceWebsockets[device.mac] = new DeviceWebsocket(
        server,
        device.mac,
        device.ip
      );
      server.localStorage.deviceWebsockets[device.mac].connectReportsSocket();
    });
  }
  if (Object.keys(removedDevices).length) {
    console.log(`[device] ${Object.keys(removedDevices).length} removed iot devices found`);
    Object.values(removedDevices).forEach((device) => {
      console.log(`[device] ${device.ip} ${getDeviceEmoji(device.ip)}: Removing websocket`);
      server.localStorage.deviceWebsockets[device.mac]?.close();
    });
  }
  server.localStorage.scrapedDevices = devices;
};
