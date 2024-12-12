/** @format */
import { PostgresDb } from '@fastify/postgres';
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';
import { QueryConfig, QueryConfigValues, QueryResultRow } from 'pg';

export class Database {
  pg: PostgresDb;

  constructor(pg: PostgresDb) {
    this.pg = pg;
  }

  query = async <Row extends QueryResultRow = any, Params = any[]>(
    query: string | QueryConfig<Params>,
    values?: QueryConfigValues<Params>
  ) => {
    const client = await this.pg.connect();
    try {
      return await client.query<Row, Params>(query, values);
    } finally {
      client.release();
    }
  };
}

export const databaseDecorator: FastifyPluginAsync = Plugin(async (server, options) => {
  server.decorateRequest('database', null);
  server.addHook('onRequest', async (request) => {
    request.database = new Database(server.pg);
  });
});
