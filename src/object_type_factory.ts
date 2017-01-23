import { FieldTypeMetadata , GQ_OBJECT_METADATA_KEY , GQ_FIELDS_KEY , ObjectTypeMetadata } from "./decorator";
import { SchemaFactoryError , SchemaFactoryErrorType } from "./schema_factory";
import { fieldTypeFactory } from "./field_type_factory";
const graphql = require("graphql");

let objectTypeRepository: {[key: string]: any} = {};

export function clearObjectTypeRepository() {
    objectTypeRepository = {};
}

export function objectTypeFactory(target: Function, isInput?: boolean) {
    const objectTypeMetadata = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, target.prototype) as ObjectTypeMetadata;
    const typeFromRepository = objectTypeRepository[objectTypeMetadata.name];
    if (typeFromRepository) {
        return typeFromRepository;
    }
    if (!!objectTypeMetadata.isInput !== !!isInput) {
        // TODO write test
        throw new SchemaFactoryError("", SchemaFactoryErrorType.INVALID_OBJECT_TYPE_METADATA);
    }
    if (!Reflect.hasMetadata(GQ_FIELDS_KEY, target.prototype)) {
        throw new SchemaFactoryError("Class annotated by @ObjectType() should has one or more fields annotated by @Filed()", SchemaFactoryErrorType.NO_FIELD);
    }
    const fieldMetadataList = Reflect.getMetadata(GQ_FIELDS_KEY, target.prototype) as FieldTypeMetadata[];
    const fields: {[key: string]: any} = {};
    fieldMetadataList.forEach(def => {
        fields[def.name] = fieldTypeFactory(target, def);
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
        fields: fieldsDict
    });

    return mutationRootObject;
}

export function queryObjectTypeFactory(fieldsDict: any) {
    return new graphql.GraphQLObjectType({
        name: 'Queries',
        description: 'Reads from the backend',
        fields: fieldsDict
    });
}
