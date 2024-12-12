/** @format */
import { JSONSchema7, JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';

import { ObjectKeys } from './objects';
import {
  ARRAY_OPERATORS,
  DEFAULT_ARRAY_OPERATOR,
  DEFAULT_NUMBER_OPERATOR,
  DEFAULT_STRING_OPERATOR,
  NUMBER_OPERATORS,
  STRING_OPERATORS,
  applyOperatorToParamName,
} from './params';

export const pickFromSchema = (schema: JSONSchema7, keys: string[]): JSONSchema7 => {
  if (schema.type !== 'object') {
    throw TypeError('Tried to pick from non-object JSON schema');
  }

  const _schema = JSON.parse(JSON.stringify(schema)) as JSONSchema7;
  const properties = _schema.properties;
  return {
    ..._schema,
    required: (_schema.required || []).filter((key) => keys.includes(key)),
    properties:
      properties &&
      keys.reduce(
        (acc, key) => {
          if (key in properties) {
            acc[key] = properties[key];
          }
          return acc;
        },
        {} as NonNullable<JSONSchema7['properties']>
      ),
  };
};

export const omitFromSchema = (schema: JSONSchema7, keys: string[]): JSONSchema7 => {
  if (schema.type !== 'object') {
    throw TypeError('Tried to pick from non-object JSON schema');
  }

  const _schema = JSON.parse(JSON.stringify(schema)) as JSONSchema7;
  const properties = _schema.properties;
  return {
    ..._schema,
    required: (_schema.required || []).filter((key) => !keys.includes(key)),
    properties:
      properties &&
      keys.reduce(
        (acc, key) => {
          delete acc[key];
          return acc;
        },
        properties as NonNullable<JSONSchema7['properties']>
      ),
  };
};

export const queryParamFilterFromSchema = (schema: JSONSchema7): JSONSchema7 => {
  if (schema.type !== 'object') {
    throw TypeError('Tried to pick from non-object JSON schema');
  }

  const _schema = JSON.parse(JSON.stringify(schema)) as JSONSchema7;
  const properties = _schema.properties;
  return {
    ..._schema,
    required: [],
    properties:
      properties &&
      Object.keys(properties || {}).reduce(
        (acc, key) => {
          const value = properties[key] as JSONSchema7;
          if (value?.type) {
            if (value.type === 'array') {
              acc[key] = {
                ...value,
                description: `Default operator: \`${DEFAULT_ARRAY_OPERATOR}\``,
              };
              Array.from(ARRAY_OPERATORS).forEach(
                (operator) => (acc[applyOperatorToParamName(key, operator)] = value as JSONSchema7)
              );
            } else if (value.type === 'number') {
              acc[key] = {
                type: 'array',
                items: value,
                description: `Default operator: \`${DEFAULT_NUMBER_OPERATOR}\``,
              };
              Array.from(NUMBER_OPERATORS).forEach(
                (operator) =>
                  (acc[applyOperatorToParamName(key, operator)] = { type: 'array', items: value })
              );
            } else if (value.type === 'string') {
              acc[key] = {
                type: 'array',
                items: value,
                description: `Default operator: \`${DEFAULT_STRING_OPERATOR}\``,
              };
              Array.from(STRING_OPERATORS).forEach(
                (operator) =>
                  (acc[applyOperatorToParamName(key, operator)] = { type: 'array', items: value })
              );
            } else if (value.type === 'object') {
              // do nothing
            } else {
              acc[key] = value;
            }
          }
          return acc;
        },
        {} as NonNullable<JSONSchema7['properties']>
      ),
  };
};
