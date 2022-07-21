/** @format */

export interface ReportWebsocketDataType {
  mac: string;
  message: string | number | boolean | null;
  metric: string;
  tags: string[];
  timestamp: string;
}

export interface DeviceStateType {
  [key: string]: ReportWebsocketDataType;
}

export interface LiveTimeDeltaPropsType {
  date: Date | number | string | null;
}
