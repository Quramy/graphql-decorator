import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * GraphQL Schema entry point
 * See [GraphQL Documentation - Arguments]{@link http://graphql.org/learn/schema/}
 *
 * @param option Options for an Schema
 */
export function Ctx() {
  return function (target: any, propertyKey: any, index: number) {
    getMetadataArgsStorage().contexts.push({
          target: target,
          name: target.name || propertyKey,
          description: null,
          index: index,
          property: propertyKey,
      });
  } as Function;
}
