/** @format */
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';

import { makePostgresFilter } from '@/common/postgres';
import { Database } from '@/decorators/database';
import { UserNoPasswordType, UserType } from '@/models/user';
import { UserNoPasswordSchema, UserSchema } from '@/models/user/schema';

import { FiltersType } from '../types';

export class UsersStore {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  static decorator: FastifyPluginAsync = Plugin(async (server, options) => {
    server.decorateRequest('usersStore', null);
    server.addHook('onRequest', async (request) => {
      request.usersStore = new UsersStore(request.database);
    });
  });

  createUser = async (user: Omit<UserType, 'id'>) => {
    const { rows } = await this.database.query<UserNoPasswordType>(
      `
INSERT INTO users (username, password, scopes) VALUES
($1, $2, $3)
RETURNING id, username, scopes
      `,
      [user.username, user.password, user.scopes]
    );
    return rows[0];
  };

  getUser = async (userId: UserType['id']): Promise<UserNoPasswordType | undefined> => {
    const { rows } = await this.database.query<UserNoPasswordType>(
      'SELECT id, username, scopes FROM users WHERE id=$1',
      [userId]
    );
    return rows[0];
  };

  getUserByUsername = async (
    username: UserType['username']
  ): Promise<UserNoPasswordType | undefined> => {
    const { rows } = await this.database.query<UserNoPasswordType>(
      'SELECT id, username, scopes FROM users WHERE username=$1',
      [username]
    );
    return rows[0];
  };

  getUsers = async (filters?: FiltersType<UserNoPasswordType>) => {
    let where = 'WHERE true';

    if (filters?.length) {
      const conditions: string[] = [];

      filters.forEach((filter) => {
        if (filter && UserNoPasswordSchema.properties?.[filter.name]) {
          conditions.push(makePostgresFilter(filter));
        }
      });

      where = `WHERE ${conditions.join(' AND ')}`;
    }

    const { rows } = await this.database.query<UserNoPasswordType>(
      `SELECT id, username, scopes FROM users ${where}`
    );

    return rows;
  };

  updateUser = async (
    user: Partial<UserNoPasswordType> & Pick<UserNoPasswordType, 'id'>
  ): Promise<UserNoPasswordType | undefined> => {
    const oldUser = await this.getUser(user.id);

    if (!oldUser) {
      return undefined;
    }

    const newUser = { ...oldUser, ...user };

    const { rows } = await this.database.query<UserNoPasswordType>(
      `
UPDATE users SET username=$2, scopes=$3
WHERE id=$1
RETURNING id, username, scopes
      `,
      [newUser.id, newUser.username, newUser.scopes]
    );
    return rows[0];
  };

  deleteUser = async (userId: UserType['id']): Promise<Pick<UserType, 'id'>> => {
    await this.database.query<UserType>('DELETE FROM users WHERE id=$1', [userId]);
    return { id: userId };
  };

  validateUserPassword = async (
    username: UserType['username'],
    password: UserType['password']
  ): Promise<UserNoPasswordType | undefined> => {
    const { rows } = await this.database.query<UserNoPasswordType>(
      'SELECT id, username, scopes FROM users WHERE username=$1 AND password=$2',
      [username, password]
    );
    return rows[0];
  };
}
