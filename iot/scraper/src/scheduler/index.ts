/** @format */
import { ServerType } from '@/server';

import { TaskCallbackType, TasksType } from './types';

export class Scheduler {
  tasks: TasksType;

  server: ServerType;

  constructor(server: ServerType) {
    this.tasks = {};
    this.server = server;
  }

  addTask = (key: string, callback: TaskCallbackType, period: number) => {
    if (!this.tasks[key]) this.tasks[key] = { key, callback, period, lastCalled: 0 };
    else console.log(`Failed to add task '${key}', key already exists already.`);
  };

  removeTask = (key: string) => {
    delete this.tasks[key];
  };

  loop = async () => {
    const now = +new Date();
    Object.values(this.tasks).forEach((task) => {
      if (now - task.lastCalled > task.period) {
        task.lastCalled = now;
        task.callback(this.server);
      }
    });
  };
}
