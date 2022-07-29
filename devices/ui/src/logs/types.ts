/** @format */

export interface LogsWebsocketDataType {
  level: string;
  mac: string;
  message: string;
  timestamp: string;
}

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}
