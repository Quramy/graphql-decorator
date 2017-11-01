import { SchemaFactoryError, SchemaFactoryErrorType } from '../type-factory';

import { FieldOption } from '../metadata';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * GraphQL Schema entry point
 * See [GraphQL Documentation - Schema]{@link http://graphql.org/learn/schema/}
 *
 * @param option Options for an Schema
 */
export function Field(option?: FieldOption) {
  return function (target: any, propertyKey: any, methodDescriptor?: any) {
    // TODO: Check if test exist for this condition and if not, add one
    if (option && option.pagination && (!methodDescriptor || !methodDescriptor.value)) {
        throw new SchemaFactoryError(`Field '${propertyKey}' can't have pagination enabled`,
          SchemaFactoryErrorType.INPUT_FIELD_SHOULD_NOT_BE_PAGINATED);
    }
    getMetadataArgsStorage().fields.push({
          target: target,
          name: propertyKey,
          description: option ? option.description : null,
          type: option ? option.type : null,
          nonNull: option ? option.nonNull : null,
          isList: option ? option.isList : null,
          pagination: option ? option.pagination : null,
      });
  } as Function;
}
