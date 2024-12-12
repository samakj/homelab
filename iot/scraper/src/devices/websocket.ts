/** @format */
import WebSocket from 'ws';

import { getDeviceEmoji } from '@/common/emojis';
import { ServerType } from '@/server';

import { Device } from './device';

export class DeviceWebsocket {
  server: ServerType;

  mac: string;
  ip: string;

  reportSocket?: WebSocket;
  logsSocket?: WebSocket;

  constructor(server: ServerType, mac: string, ip: string) {
    this.server = server;
    this.mac = mac;
    this.ip = ip;

    if (!this.server.localStorage.devices[mac]) {
      this.server.localStorage.devices[mac] = new Device(mac, ip);
    }
  }

  connectReportsSocket = () => {
    if (!this.reportSocket) {
      this.reportSocket = new WebSocket(`ws://${this.ip}/reports`);
      this.reportSocket.on('message', this.handleReportMessage);
      this.reportSocket.on('error', (error) =>
        console.error(
          `[socket] ${this.ip} ${getDeviceEmoji(this.ip)}: Report websocket errored`,
          error
        )
      );
      this.reportSocket.on('close', (code) =>
        console.error(
          `[socket] ${this.ip} ${getDeviceEmoji(this.ip)}: Report websocket closed, code: ${code}`
        )
      );
    }
  };

  handleReportMessage = (_data: string) => {
    let data: Record<string, any> = {};
    try {
      data = JSON.parse(_data);
      console.log(
        `[socket] ${this.ip} ${getDeviceEmoji(this.ip)}:`,
        JSON.stringify(data)
          .replaceAll('{', '{ ')
          .replaceAll('}', ' }')
          .replaceAll(':', ': ')
          .replaceAll(',', ', ')
      );
    } catch (error) {}

    if (data?.id) this.server.localStorage.devices[this.mac].updateSourceValue(data.id, data);
    else
      console.error(
        `[socket] ${this.ip} ${getDeviceEmoji(this.ip)}: Bad report recieved '${_data}'`
      );
  };

  close = () => {
    this.reportSocket?.close();
    this.logsSocket?.close();
  };
}
