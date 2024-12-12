/** @format */
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';

import { makePostgresFilter } from '@/common/postgres';
import { Database } from '@/decorators/database';
import { LocationType } from '@/models/location';
import { LocationSchema } from '@/models/location/schema';

import { FiltersType } from '../types';

export class LocationsStore {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  static decorator: FastifyPluginAsync = Plugin(async (server, options) => {
    server.decorateRequest('locationsStore', null);
    server.addHook('onRequest', async (request) => {
      request.locationsStore = new LocationsStore(request.database);
    });
  });

  createLocation = async (location: Omit<LocationType, 'id'>) => {
    const { rows } = await this.database.query<LocationType>(
      `
INSERT INTO locations (name, tags) VALUES
($1, $2)
RETURNING *
      `,
      [location.name, location.tags]
    );
    return rows[0];
  };

  getLocation = async (locationId: LocationType['id']): Promise<LocationType | undefined> => {
    const { rows } = await this.database.query<LocationType>(
      'SELECT * FROM locations WHERE id=$1',
      [locationId]
    );
    return rows[0];
  };

  getLocations = async (filters?: FiltersType<LocationType>) => {
    let where = 'WHERE true';

    if (filters?.length) {
      const conditions: string[] = [];

      filters.forEach((filter) => {
        if (filter && LocationSchema.properties?.[filter.name]) {
          conditions.push(makePostgresFilter(filter));
        }
      });

      where = `WHERE ${conditions.join(' AND ')}`;
    }

    const { rows } = await this.database.query<LocationType>(`SELECT * FROM locations ${where}`);

    return rows;
  };

  updateLocation = async (
    location: Partial<LocationType> & Pick<LocationType, 'id'>
  ): Promise<LocationType | undefined> => {
    const oldLocation = await this.getLocation(location.id);

    if (!oldLocation) {
      return undefined;
    }

    const newLocation = { ...oldLocation, ...location };

    const { rows } = await this.database.query<LocationType>(
      `
UPDATE locations SET name=$2, tags=$3
WHERE id=$1
RETURNING *
      `,
      [newLocation.id, newLocation.name, newLocation.tags]
    );
    return rows[0];
  };

  deleteLocation = async (locationId: LocationType['id']): Promise<Pick<LocationType, 'id'>> => {
    await this.database.query<LocationType>('DELETE FROM locations WHERE id=$1', [locationId]);
    return { id: locationId };
  };
}
