import * as graphql from 'graphql';

import { EntryType, EntryTypeMetadata, FieldMetadata, ObjectTypeMetadata } from '../metadata';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { mutationObjectTypeFactory, queryObjectTypeFactory, subscriptionObjectTypeFactory } from './object.type-factory';

import { fieldTypeFactory } from './field.type-factory';
import { objectTypeFactory } from './object.type-factory';
import { getMetadataBuilder, getMetadataArgsStorage } from '../metadata-builder';

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
  INPUT_FIELD_SHOULD_NOT_HAVE_INTERFACE,
}

export class SchemaFactoryError extends Error {
  constructor(msg: string, public type: SchemaFactoryErrorType) {
    super(msg);
    this.message = msg;
  }
}

function getEntryObject(
  target: any,
  type: EntryType,
  mandatory: boolean,
  entryObjectTypeFactory: (fieldsDict: any) => GraphQLObjectType,
) {

  const metadatas: EntryTypeMetadata[] = getMetadataBuilder().buildEntryTypeMetadata(target, type);
  if (mandatory && (!metadatas || metadatas.length === 0)) {
    throw new SchemaFactoryError(`Target should have @${type} field`, SchemaFactoryErrorType.NO_QUERY_FIELD);
  }

  let fieldMap = metadatas.map(metadata => {
    const fieldTarget = Reflect.getMetadata('design:type', metadata.target, metadata.property) as Function;
    const fieldMetadatas = getMetadataBuilder().buildFieldMetadata(fieldTarget.prototype);
    return fieldMetadatas.reduce((fields, fieldMetadata) => {
      fields[fieldMetadata.name] = fieldTypeFactory(fieldTarget, fieldMetadata, undefined, metadata.isSubscription);
      return fields;
    }, {} as { [key: string]: any });
  })
  .reduce((map, fields) => ({ ...map, ...fields }), {});

  return Object.keys(fieldMap).length > 0 ? entryObjectTypeFactory(fieldMap) : undefined;

}

function getAllTypes() {
  return getMetadataArgsStorage()
    .objects
    .filter(arg => arg.interfaces.length > 0)
    .map(arg => objectTypeFactory(arg.target, arg.isInput));
}

export function schemaFactory(target: Function) {
  if (getMetadataBuilder().buildSchemaMetadata(target).length !== 1) {
    throw new SchemaFactoryError('One and only one argument of schemaFactory should be annotated with @Schema() decorator',
      SchemaFactoryErrorType.NO_SCHEMA_ANNOTATION);
  }

  const query = getEntryObject(target, EntryType.Query, true, queryObjectTypeFactory);
  const mutation = getEntryObject(target, EntryType.Mutation, false, mutationObjectTypeFactory);
  const subscription = getEntryObject(target, EntryType.Subscription, false, subscriptionObjectTypeFactory);
  const types = getAllTypes();

  return new graphql.GraphQLSchema({
    query: query,
    mutation: mutation,
    subscription: subscription,
    types: types,
  });
}
