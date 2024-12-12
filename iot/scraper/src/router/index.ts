/** @format */
import { ServerType } from '@/server';

import config from '../config.secret.json';

export const getRouterDevices = async (server: ServerType) => {
  // console.log('[router] Fetching devices connected to the router');

  await fetch(`http://${config.router.ip}/JNAP/`, {
    headers: {
      'x-jnap-action': 'http://linksys.com/jnap/devicelist/GetDevices',
      'x-jnap-authorization': `Basic ${config.router.auth}`,
    },
    body: '{}',
    method: 'POST',
  })
    .then((r) => r.json())
    .then((data) => {
      server.localStorage.routerDevices = {};
      data.output.devices.forEach((device: any) =>
        device.connections.forEach(
          (connection: any) =>
            (server.localStorage.routerDevices[connection.macAddress] = {
              mac: connection.macAddress,
              ip: connection.ipAddress,
            })
        )
      );
    });

  // console.log(
  //   `[router] ${Object.keys(server.localStorage.routerDevices).length} devices known to router`
  // );

  await fetch(`http://${config.router.ip}/JNAP/`, {
    headers: {
      'x-jnap-action':
        'http://linksys.com/jnap/nodes/networkconnections/GetNodesWirelessNetworkConnections',
      'x-jnap-authorization': `Basic ${config.router.auth}`,
    },
    body: '{}',
    method: 'POST',
  })
    .then((r) => r.json())
    .then((data) => {
      server.localStorage.routerConnectedDevices = {};
      data.output.nodeWirelessConnections.forEach((node: any) =>
        node.connections.forEach((connection: any) => {
          server.localStorage.routerConnectedDevices[connection.macAddress] = {
            mac: connection.macAddress,
            timestamp: connection.timestamp,
            speed: connection.negotiatedMbps,
          };
        })
      );
    });

  // console.log(
  //   `[router] ${Object.keys(server.localStorage.routerConnectedDevices).length} devices connected to router`
  // );
};
