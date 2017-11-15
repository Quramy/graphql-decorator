import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * Injects the root query object into resolve function
 *
 * @param option Options for an Schema
 */
export function Root() {
  return function (target: any, propertyKey: any, index: number) {
    getMetadataArgsStorage().roots.push({
      target: target,
      name: target.name || propertyKey,
      description: null,
      index: index,
      property: propertyKey,
    });
  } as Function;
}
