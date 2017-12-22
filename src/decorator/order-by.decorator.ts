import { OrderByOption } from '../metadata';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * Configures and inject order by parameters for an {@see Field} with `pagination` parameter enabled.
 *
 * @param option Options for OrderBy
 */
export function OrderBy(option?: OrderByOption | string[]) {
  return function (target: any, propertyKey: any, index: number) {
    getMetadataArgsStorage().orderBys.push({
      target: target,
      name: 'orderBy', //TODO: remove hard coded string coupling from OrderByTypeFactory
      description: (option ? (option as OrderByOption).description : null),
      index: index,
      property: propertyKey,
      extraColumns: (option && option.constructor === Array) ? option as string[] :
        (option ? (option as OrderByOption).extraColumns : []),
      shouldIgnoreSchemaFields: option && option.constructor !== Array ? (option as OrderByOption).shouldIgnoreSchemaFields : false,
    });
  } as Function;
}
