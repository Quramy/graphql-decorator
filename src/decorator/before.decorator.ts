import { BeforeOption } from '../metadata';
import { Middleware } from '../middleware';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * GraphQL Schema entry point
 * See [GraphQL Documentation - Arguments]{@link http://graphql.org/learn/schema/}
 *
 * @param option Options for an Schema
 */
export function Before(option: BeforeOption | Middleware) {
  return function (target: any, propertyKey: any, index: number) {
    getMetadataArgsStorage().befores.push({
          target: target,
          name: target.name || propertyKey,
          description: option && (option as BeforeOption).description ? (option as BeforeOption).description : null,
          index: index,
          property: propertyKey,
          middleware: option && (option as BeforeOption).middleware ? (option as BeforeOption).middleware : option as Middleware,
      });
  } as Function;
}
