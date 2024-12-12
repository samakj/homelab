/** @format */

export interface LogsTerminalPropsType {}

export interface LogMessageType {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}
