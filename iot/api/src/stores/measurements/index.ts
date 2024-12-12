/** @format */
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';

import { makePostgresFilter } from '@/common/postgres';
import { Database } from '@/decorators/database';
import { MeasurementType } from '@/models/measurement';
import { MeasurementSchema } from '@/models/measurement/schema';

import { FiltersType } from '../types';
import { MeasurementDBType } from './types';

export class MeasurementsStore {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  static decorator: FastifyPluginAsync = Plugin(async (server, options) => {
    server.decorateRequest('measurementsStore', null);
    server.addHook('onRequest', async (request) => {
      request.measurementsStore = new MeasurementsStore(request.database);
    });
  });

  createMeasurement = async (measurement: Omit<MeasurementType, 'id'>) => {
    const { rows } = await this.database.query<MeasurementDBType>(
      `
INSERT INTO measurements (timestamp, device_id, location_id, metric_id, tags, value) VALUES
($1, $2, $3, $4, $5, $6)
RETURNING *
      `,
      [
        measurement.timestamp,
        measurement.device_id,
        measurement.location_id,
        measurement.metric_id,
        measurement.tags,
        { value: measurement.value },
      ]
    );
    return { ...rows[0], value: rows[0].value.value };
  };

  getMeasurement = async (
    measurementId: MeasurementType['id']
  ): Promise<MeasurementType | undefined> => {
    const { rows } = await this.database.query<MeasurementDBType>(
      'SELECT * FROM measurements WHERE id=$1',
      [measurementId]
    );
    return rows[0] ? { ...rows[0], value: rows[0].value.value } : undefined;
  };

  getMeasurements = async (filters?: FiltersType<MeasurementType>) => {
    let where = 'WHERE true';

    if (filters?.length) {
      const conditions: string[] = [];

      filters.forEach((filter) => {
        if (filter && MeasurementSchema.properties?.[filter.name]) {
          conditions.push(makePostgresFilter(filter));
        }
      });

      where = `WHERE ${conditions.join(' AND ')}`;
    }

    const { rows } = await this.database.query<MeasurementDBType>(
      `SELECT * FROM measurements ${where}`
    );

    return rows.map((row) => ({ ...row, value: row.value.value }));
  };

  updateMeasurement = async (
    measurement: Partial<MeasurementType> & Pick<MeasurementType, 'id'>
  ): Promise<MeasurementType | undefined> => {
    const oldMeasurement = await this.getMeasurement(measurement.id);

    if (!oldMeasurement) {
      return undefined;
    }

    const newMeasurement = { ...oldMeasurement, ...measurement };

    const { rows } = await this.database.query<MeasurementDBType>(
      `
UPDATE measurements SET timestamp=$2, device_id=$3, location_id=$4, metric_id=$5, tags=$6, value=$7
WHERE id=$1
RETURNING *
      `,
      [
        newMeasurement.id,
        newMeasurement.timestamp,
        newMeasurement.device_id,
        newMeasurement.location_id,
        newMeasurement.metric_id,
        newMeasurement.tags,
        newMeasurement.value,
      ]
    );
    return { ...rows[0], value: rows[0].value.value };
  };

  deleteMeasurement = async (
    measurementId: MeasurementType['id']
  ): Promise<Pick<MeasurementType, 'id'>> => {
    await this.database.query<MeasurementDBType>('DELETE FROM measurements WHERE id=$1', [
      measurementId,
    ]);
    return { id: measurementId };
  };
}
