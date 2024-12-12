/** @format */
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';

import { makePostgresFilter } from '@/common/postgres';
import { Database } from '@/decorators/database';
import { SessionType } from '@/models/session';
import { SessionSchema } from '@/models/session/schema';

import { FiltersType } from '../types';

export class SessionsStore {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  static decorator: FastifyPluginAsync = Plugin(async (server, options) => {
    server.decorateRequest('sessionsStore', null);
    server.addHook('onRequest', async (request) => {
      request.sessionsStore = new SessionsStore(request.database);
    });
  });

  createSession = async (session: Omit<SessionType, 'id'>) => {
    const { rows } = await this.database.query<SessionType>(
      `
INSERT INTO sessions (user_id, created, disabled) VALUES
($1, $2, $3)
RETURNING *
      `,
      [session.user_id, session.created, session.disabled]
    );
    return rows[0];
  };

  getSession = async (sessionId: SessionType['id']): Promise<SessionType | undefined> => {
    const { rows } = await this.database.query<SessionType>('SELECT * FROM sessions WHERE id=$1', [
      sessionId,
    ]);
    return rows[0];
  };

  getSessions = async (filters?: FiltersType<SessionType>) => {
    let where = 'WHERE true';

    if (filters?.length) {
      const conditions: string[] = [];

      filters.forEach((filter) => {
        if (filter && SessionSchema.properties?.[filter.name]) {
          conditions.push(makePostgresFilter(filter));
        }
      });

      where = `WHERE ${conditions.join(' AND ')}`;
    }

    const { rows } = await this.database.query<SessionType>(`SELECT * FROM sessions ${where}`);

    return rows;
  };

  updateSession = async (
    session: Partial<SessionType> & Pick<SessionType, 'id'>
  ): Promise<SessionType | undefined> => {
    const oldSession = await this.getSession(session.id);

    if (!oldSession) {
      return undefined;
    }

    const newSession = { ...oldSession, ...session };

    const { rows } = await this.database.query<SessionType>(
      `
UPDATE sessions SET user_id=$2, created=$3, disabled=$4
WHERE id=$1
RETURNING *
      `,
      [newSession.id, newSession.user_id, newSession.created, newSession.disabled]
    );
    return rows[0];
  };

  deleteSession = async (sessionId: SessionType['id']): Promise<Pick<SessionType, 'id'>> => {
    await this.database.query<SessionType>('DELETE FROM sessions WHERE id=$1', [sessionId]);
    return { id: sessionId };
  };
}
