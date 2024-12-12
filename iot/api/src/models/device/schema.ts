/** @format */
import { JSONSchema7 } from 'json-schema';

import { LocationSchema } from '../location/schema';

export const DeviceSchema: JSONSchema7 = {
  type: 'object',
  required: ['id', 'mac', 'ip', 'location_id'],
  properties: {
    id: { type: 'number' },
    mac: { type: 'string' },
    ip: { type: 'string' },
    location_id: (LocationSchema.properties as NonNullable<JSONSchema7['properties']>).id,
    last_message: { type: 'string' },
  },
};
