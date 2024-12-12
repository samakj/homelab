/** @format */
import { JSONSchema7 } from 'json-schema';

import { DeviceSchema } from '../device/schema';
import { LocationSchema } from '../location/schema';
import { MetricSchema } from '../metric/schema';

export const MeasurementSchema: JSONSchema7 = {
  type: 'object',
  required: ['id', 'timestamp', 'device_id', 'location_id', 'metric_id'],
  properties: {
    id: { type: 'number' },
    timestamp: { type: 'string' },
    device_id: (DeviceSchema.properties as NonNullable<JSONSchema7['properties']>).id,
    location_id: (LocationSchema.properties as NonNullable<JSONSchema7['properties']>).id,
    metric_id: (MetricSchema.properties as NonNullable<JSONSchema7['properties']>).id,
    tags: { type: 'array', items: { type: 'string' } },
    value: { type: ['string', 'number', 'boolean', 'null'] },
  },
};
