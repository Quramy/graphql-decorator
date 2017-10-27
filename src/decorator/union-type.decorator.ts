import { getMetadataArgsStorage } from '../metadata-builder';
import { UnionOption } from '../metadata';

/**
 * Union Type.
 * See [GraphQL Documentation - Union Types]{@link http://graphql.org/learn/schema/#union-types}
 *
 * @param option Options for an Union Type
 */
export function UnionType<T>(option: UnionOption<T>) {
  return function (target: any) {
    getMetadataArgsStorage().union.push({
          target: target,
          name: target.name,
          types: option.types,
          resolver: option.resolver,
          description: option.description,
      });
  } as Function;
}
