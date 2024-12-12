/** @format */
import { ServerType } from '@/server';

export type TaskCallbackType = (server: ServerType) => any;

export interface TaskType {
  key: string;
  callback: TaskCallbackType;
  period: number;
  lastCalled: number;
}

export interface TasksType {
  [key: string]: TaskType;
}
