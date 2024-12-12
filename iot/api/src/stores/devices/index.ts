/** @format */
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';

import { makePostgresFilter } from '@/common/postgres';
import { Database } from '@/decorators/database';
import { DeviceType } from '@/models/device';
import { DeviceSchema } from '@/models/device/schema';

import { FiltersType } from '../types';

export class DevicesStore {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  static decorator: FastifyPluginAsync = Plugin(async (server, options) => {
    server.decorateRequest('devicesStore', null);
    server.addHook('onRequest', async (request) => {
      request.devicesStore = new DevicesStore(request.database);
    });
  });

  createDevice = async (device: Omit<DeviceType, 'id'>) => {
    const { rows } = await this.database.query<DeviceType>(
      `
INSERT INTO devices (mac, ip, location_id, last_message) VALUES
($1, $2, $3, $4)
RETURNING *
      `,
      [device.mac, device.ip, device.location_id, device.last_message]
    );
    return rows[0];
  };

  getDevice = async (deviceId: DeviceType['id']): Promise<DeviceType | undefined> => {
    const { rows } = await this.database.query<DeviceType>('SELECT * FROM devices WHERE id=$1', [
      deviceId,
    ]);
    return rows[0];
  };

  getDevices = async (filters?: FiltersType<DeviceType>) => {
    let where = 'WHERE true';

    if (filters?.length) {
      const conditions: string[] = [];

      filters.forEach((filter) => {
        if (filter && DeviceSchema.properties?.[filter.name]) {
          conditions.push(makePostgresFilter(filter));
        }
      });

      where = `WHERE ${conditions.join(' AND ')}`;
    }

    const { rows } = await this.database.query<DeviceType>(`SELECT * FROM devices ${where}`);

    return rows;
  };

  updateDevice = async (
    device: Partial<DeviceType> & Pick<DeviceType, 'id'>
  ): Promise<DeviceType | undefined> => {
    const oldDevice = await this.getDevice(device.id);

    if (!oldDevice) {
      return undefined;
    }

    const newDevice = { ...oldDevice, ...device };

    const { rows } = await this.database.query<DeviceType>(
      `
UPDATE devices SET mac=$2, ip=$3, location_id=$4, last_message=$5
WHERE id=$1
RETURNING *
      `,
      [newDevice.id, newDevice.mac, newDevice.ip, newDevice.location_id, newDevice.last_message]
    );
    return rows[0];
  };

  deleteDevice = async (deviceId: DeviceType['id']): Promise<Pick<DeviceType, 'id'>> => {
    await this.database.query<DeviceType>('DELETE FROM devices WHERE id=$1', [deviceId]);
    return { id: deviceId };
  };
}
