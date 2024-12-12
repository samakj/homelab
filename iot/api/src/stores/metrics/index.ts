/** @format */
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';

import { makePostgresFilter } from '@/common/postgres';
import { Database } from '@/decorators/database';
import { MetricType } from '@/models/metric';
import { MetricSchema } from '@/models/metric/schema';

import { FiltersType } from '../types';

export class MetricsStore {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  static decorator: FastifyPluginAsync = Plugin(async (server, options) => {
    server.decorateRequest('metricsStore', null);
    server.addHook('onRequest', async (request) => {
      request.metricsStore = new MetricsStore(request.database);
    });
  });

  createMetric = async (metric: Omit<MetricType, 'id'>) => {
    const { rows } = await this.database.query<MetricType>(
      `
INSERT INTO metrics (name, abbreviation, unit) VALUES
($1, $2, $3)
RETURNING *
      `,
      [metric.name, metric.abbreviation, metric.unit]
    );
    return rows[0];
  };

  getMetric = async (metricId: MetricType['id']): Promise<MetricType | undefined> => {
    const { rows } = await this.database.query<MetricType>('SELECT * FROM metrics WHERE id=$1', [
      metricId,
    ]);
    return rows[0];
  };

  getMetrics = async (filters?: FiltersType<MetricType>) => {
    let where = 'WHERE true';

    if (filters?.length) {
      const conditions: string[] = [];

      filters.forEach((filter) => {
        if (filter && MetricSchema.properties?.[filter.name]) {
          conditions.push(makePostgresFilter(filter));
        }
      });

      where = `WHERE ${conditions.join(' AND ')}`;
    }

    const { rows } = await this.database.query<MetricType>(`SELECT * FROM metrics ${where}`);

    return rows;
  };

  updateMetric = async (
    metric: Partial<MetricType> & Pick<MetricType, 'id'>
  ): Promise<MetricType | undefined> => {
    const oldMetric = await this.getMetric(metric.id);

    if (!oldMetric) {
      return undefined;
    }

    const newMetric = { ...oldMetric, ...metric };

    const { rows } = await this.database.query<MetricType>(
      `
UPDATE metrics SET name=$2, abbreviation=$3, unit=$4
WHERE id=$1
RETURNING *
      `,
      [newMetric.id, newMetric.name, newMetric.abbreviation, newMetric.unit]
    );
    return rows[0];
  };

  deleteMetric = async (metricId: MetricType['id']): Promise<Pick<MetricType, 'id'>> => {
    await this.database.query<MetricType>('DELETE FROM metrics WHERE id=$1', [metricId]);
    return { id: metricId };
  };
}
