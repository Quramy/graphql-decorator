import * as graphql from 'graphql';

import { SchemaFactoryError, SchemaFactoryErrorType } from './schema.type-factory';

import { FieldMetadata } from '../metadata/types';
import { GraphQLObjectType } from 'graphql';
import { ObjectTypeMetadata } from '../metadata/types';
import { fieldTypeFactory } from '../type-factory';
import { getMetadataBuilder } from '../metadata-builder';

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
          const fieldMetadataList: FieldMetadata[] = getMetadataBuilder().buildFieldMetadata(target.prototype);
          if (fieldMetadataList.length === 0) {
              throw new SchemaFactoryError('Class annotated by @ObjectType() should has one or more fields annotated by @Field()',
                SchemaFactoryErrorType.NO_FIELD);
          }

          const fields = fieldMetadataList.reduce((map, fieldMetadata) => {
            let field = fieldTypeFactory(target, fieldMetadata, isInput);
            if (!field) {
                throw new SchemaFactoryError(`@ObjectType()'s ${fieldMetadata.name} is annotated by @Field() but no type could be inferred`,
                  SchemaFactoryErrorType.NO_FIELD);
            }
            map[fieldMetadata.name] = field;
            return map;
          }, {} as { [key: string]: any });

          const params = {
              name: metadata.name,
              fields,
              description: metadata.description,
          };

          objectTypeRepository[metadata.name] = isInput ? new graphql.GraphQLInputObjectType(params) : new graphql.GraphQLObjectType(params);
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
