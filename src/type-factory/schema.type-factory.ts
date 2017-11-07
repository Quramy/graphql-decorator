import * as graphql from 'graphql';

import { EntryType, EntryTypeMetadata, FieldMetadata } from '../metadata';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { mutationObjectTypeFactory, queryObjectTypeFactory, subscriptionObjectTypeFactory } from './object.type-factory';

import { fieldTypeFactory } from './field.type-factory';
import { getMetadataBuilder } from '../metadata-builder';

export enum SchemaFactoryErrorType {
    NO_SCHEMA_ANNOTATION,
    NO_QUERY_FIELD,
    NO_FIELD,
    NO_VALUE,
    NO_TYPE_ORDERBY_PARENT_FIELD,
    INVALID_OBJECT_TYPE_METADATA,
    INPUT_FIELD_SHOULD_NOT_BE_FUNC,
    INPUT_FIELD_SHOULD_NOT_BE_PAGINATED,
    VALUE_SHOULD_NOT_BE_FUNC,
    ORDER_BY_OUTSIDE_PAGINATION,
}

function getEntryObject(
  target: any,
  type: EntryType,
  mandatory: boolean,
  objectTypeFactory: (fieldsDict: any) => GraphQLObjectType,
) {

  const metadatas: EntryTypeMetadata[] = getMetadataBuilder().buildEntryTypeMetadata(target, type);
  if (mandatory && (!metadatas || metadatas.length === 0)) {
      throw new SchemaFactoryError(`Target should have @${type} field`, SchemaFactoryErrorType.NO_QUERY_FIELD);
  }

  return metadatas.map(metadata => {
      const fieldTarget = Reflect.getMetadata('design:type', metadata.target, metadata.property) as Function;
      const fieldMetadatas = getMetadataBuilder().buildFieldMetadata(fieldTarget.prototype);
      return fieldMetadatas.reduce((fields, fieldMetadata) => {
        fields[fieldMetadata.name] = fieldTypeFactory(fieldTarget, fieldMetadata, undefined, metadata.isSubscription);
        return fields;
      } , {} as { [key: string]: any });
    })
    .map(fields => objectTypeFactory(fields))
    .find((value, index) => index === 0);

}

export class SchemaFactoryError extends Error {
    constructor(msg: string, public type: SchemaFactoryErrorType) {
        super(msg);
        this.message = msg;
    }
}

export function schemaFactory(target: Function) {
    if (getMetadataBuilder().buildSchemaMetadata(target).length !== 1) {
        throw new SchemaFactoryError('One and only one argument of schemaFactory should be annotated with @Schema() decorator',
          SchemaFactoryErrorType.NO_SCHEMA_ANNOTATION);
    }

    let query = getEntryObject(target, EntryType.Query, true, queryObjectTypeFactory);
    let mutation = getEntryObject(target, EntryType.Mutation, false, mutationObjectTypeFactory);
    let subscription = getEntryObject(target, EntryType.Subscription, false, subscriptionObjectTypeFactory);

    return new graphql.GraphQLSchema({
        query: query,
        mutation: mutation,
        subscription: subscription,
    });
}
