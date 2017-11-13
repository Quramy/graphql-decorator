import { getMetadataArgsStorage } from '../metadata-builder';
import { InterfaceOption } from '../index';

/**
 * Union Type.
 * See [GraphQL Documentation - Union Types]{@link http://graphql.org/learn/schema/#union-types}
 *
 * @param option Options for an Union Type
 */
export function InterfaceType<T>(option: InterfaceOption<T>) {
  return function (target: any) {
    getMetadataArgsStorage().interfaces.push({
      target: target,
      name: target.name,
      resolver: option.resolver,
      description: option.description,
    });
  } as Function;
}
