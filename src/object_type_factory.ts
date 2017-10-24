import * as graphql from 'graphql';

import { FieldTypeMetadata, GQ_FIELDS_KEY, GQ_OBJECT_METADATA_KEY, ObjectTypeMetadata } from './decorator';
import { SchemaFactoryError, SchemaFactoryErrorType } from './schema_factory';

import { GraphQLObjectType } from 'graphql';
import { fieldTypeFactory } from './field_type_factory';

let objectTypeRepository: { [key: string]: any } = {};

export function clearObjectTypeRepository() {
    objectTypeRepository = {};
}

export function objectTypeByName(name: string): any {
  return objectTypeRepository[name];
}

export function objectTypeFactory(target: Function, isInput?: boolean) {
    const objectTypeMetadata = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, target.prototype) as ObjectTypeMetadata;
    const typeFromRepository = objectTypeRepository[objectTypeMetadata.name];
    if (typeFromRepository) {
        return typeFromRepository;
    }
    if (!!objectTypeMetadata.isInput !== !!isInput) {
        // TODO write test
        throw new SchemaFactoryError('', SchemaFactoryErrorType.INVALID_OBJECT_TYPE_METADATA);
    }
    if (!Reflect.hasMetadata(GQ_FIELDS_KEY, target.prototype)) {
        // tslint:disable-next-line:max-line-length
        throw new SchemaFactoryError('Class annotated by @ObjectType() should has one or more fields annotated by @Field()', SchemaFactoryErrorType.NO_FIELD);
    }
    const fieldMetadataList = Reflect.getMetadata(GQ_FIELDS_KEY, target.prototype) as FieldTypeMetadata[];
    const fields: { [key: string]: any } = {};
    fieldMetadataList.forEach(def => {
        let field = fieldTypeFactory(target, def, isInput);
        if (!field) {
            // tslint:disable-next-line:max-line-length
            throw new SchemaFactoryError(`@ObjectType()'s ${def.name} is annotated by @Field() but no type could be inferred`, SchemaFactoryErrorType.NO_FIELD);
        }
        fields[def.name] = field;
    });
    if (!!isInput) {
        objectTypeRepository[objectTypeMetadata.name] = new graphql.GraphQLInputObjectType({
            name: objectTypeMetadata.name,
            fields,
            description: objectTypeMetadata.description,
        });
    } else {
        objectTypeRepository[objectTypeMetadata.name] = new graphql.GraphQLObjectType({
            name: objectTypeMetadata.name,
            fields,
            description: objectTypeMetadata.description,
        });
    }
    return objectTypeRepository[objectTypeMetadata.name];
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
