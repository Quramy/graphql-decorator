import * as graphql from 'graphql';

import { FieldTypeMetadata, GQ_FIELDS_KEY } from '../decorator';
import { SchemaFactoryError, SchemaFactoryErrorType } from './schema.type-factory';

import { GraphQLObjectType } from 'graphql';
import { fieldTypeFactory } from '../field_type_factory';

import { getMetadataBuilder } from '../metadata-builder';
import { ObjectTypeMetadata } from '../metadata/types';

let objectTypeRepository: { [key: string]: graphql.GraphQLInputObjectType | graphql.GraphQLObjectType } = {};

export function clearObjectTypeRepository() {
    objectTypeRepository = {};
}

export function objectTypeFactory(target: Function, isInput: boolean = false): graphql.GraphQLInputObjectType | graphql.GraphQLObjectType {
    return getMetadataBuilder()
      .buildObjectTypeMetadata(target)
      .map(metadata => {
          const cached = objectTypeRepository[metadata.name];
          if (cached) {
              return cached;
          }
          if (metadata.isInput !== isInput) {
              // TODO write test
              throw new SchemaFactoryError('', SchemaFactoryErrorType.INVALID_OBJECT_TYPE_METADATA);
          }
          if (!Reflect.hasMetadata(GQ_FIELDS_KEY, target.prototype)) {
              throw new SchemaFactoryError('Class annotated by @ObjectType() should has one or more fields annotated by @Field()',
                SchemaFactoryErrorType.NO_FIELD);
          }
          const fieldMetadataList = Reflect.getMetadata(GQ_FIELDS_KEY, target.prototype) as FieldTypeMetadata[];
          const fields: { [key: string]: any } = {};
          fieldMetadataList.forEach(def => {
              let field = fieldTypeFactory(target, def, isInput);
              if (!field) {
                  throw new SchemaFactoryError(`@ObjectType()'s ${def.name} is annotated by @Field() but no type could be inferred`,
                    SchemaFactoryErrorType.NO_FIELD);
              }
              fields[def.name] = field;
          });

          const params = {
              name: metadata.name,
              fields,
              description: metadata.description,
          };

          if (isInput) {
              objectTypeRepository[metadata.name] = new graphql.GraphQLInputObjectType(params);
          } else {
              objectTypeRepository[metadata.name] = new graphql.GraphQLObjectType(params);
          }
          return objectTypeRepository[metadata.name];
      })
      .find((value, index) => index === 0);
}

export function mutationObjectTypeFactory(fieldsDict: any) {
    let mutationRootObject = new graphql.GraphQLObjectType({
        name: 'Mutations',
        description: 'Perform actions over the backend',
        fields: fieldsDict,
    });

    return mutationRootObject;
}

export function queryObjectTypeFactory(fieldsDict: any) {
    return new graphql.GraphQLObjectType({
        name: 'Queries',
        description: 'Reads from the backend',
        fields: fieldsDict,
    });
}

export function subscriptionObjectTypeFactory(fieldsDict: any) {
    return new graphql.GraphQLObjectType({
        name: 'Subscriptions',
        description: 'Realtime stream from the backend',
        fields: fieldsDict,
    });
}
