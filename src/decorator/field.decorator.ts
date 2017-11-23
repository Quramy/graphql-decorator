import { SchemaFactoryError, SchemaFactoryErrorType } from '../type-factory';

import { FieldOption } from '../metadata';
import { PaginationMiddleware } from '../middleware';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * GraphQL Schema field
 * See [GraphQL Documentation - Field]{@link http://graphql.org/learn/queries/#fields}
 *
 * @param option Options for an Schema
 */
export function Field(option?: FieldOption) {
  return function (target: any, propertyKey: any, methodDescriptor?: any) {
    if (option && option.pagination && (!methodDescriptor || !methodDescriptor.value)) {
      throw new SchemaFactoryError(`Field '${propertyKey}' can't have pagination enabled`,
        SchemaFactoryErrorType.INPUT_FIELD_SHOULD_NOT_BE_PAGINATED);
    }
    getMetadataArgsStorage().fields.push({
      target: target,
      name: propertyKey,
      description: option ? option.description : null,
      property: propertyKey,
      type: option ? option.type : null,
      nonNull: option ? option.nonNull : null,
      isList: option ? option.isList : null,
      pagination: option ? option.pagination : null,
    });
    if (option && option.pagination) {
      return PaginationMiddleware(target, propertyKey, methodDescriptor);
    }
  } as Function;
}
