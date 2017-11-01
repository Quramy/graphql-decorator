import { ArgumentOption } from '../metadata';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * GraphQL Schema entry point
 * See [GraphQL Documentation - Arguments]{@link http://graphql.org/learn/schema/}
 *
 * @param option Options for an Schema
 */
export function Arg(option?: ArgumentOption) {
  return function (target: any, propertyKey: any, index: number) {
    getMetadataArgsStorage().arguments.push({
          target: target,
          name: option.name,
          description: option ? option.description : null,
          index: index,
          property: propertyKey,
          type: option ? option.type : null,
          nonNull: option ? option.nonNull : null,
          isList: option ? option.isList : null,
      });
  } as Function;
}
