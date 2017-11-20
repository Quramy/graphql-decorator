import { getMetadataArgsStorage } from '../metadata-builder';
import { InterfaceOption } from '../index';

/**
 * Interface Type.
 * See [GraphQL Documentation - Interfaces]{@link http://graphql.org/learn/schema/#interfaces}
 *
 * @param option Options for an Interface definition
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
