import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * Ads the ability to add HTTP request context to each resolver function
 * See [Express GraphQL Documentation 'context' Option]{@link https://github.com/graphql/express-graphql#options} for an example
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
