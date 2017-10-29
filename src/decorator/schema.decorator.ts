import { getMetadataArgsStorage } from '../metadata-builder';
import { SchemaOption } from '../metadata';

/**
 * GraphQL Schema entry point
 * See [GraphQL Documentation - Schema]{@link http://graphql.org/learn/schema/}
 *
 * @param option Options for an Schema
 */
export function Schema(option?: SchemaOption) {
  return function (target: any) {
    getMetadataArgsStorage().schemas.push({
          target: target,
          name: target.name,
          description: option ? option.description : null,
      });
  } as Function;
}
