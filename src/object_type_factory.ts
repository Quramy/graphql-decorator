import { FieldTypeMetadata } from "./decorator";
import { SchemaFactoryError , SchemaFactoryErrorType } from "./schema_factory";
import { fieldTypeFactory } from "./field_type_factory";
const graphql = require("graphql");

let objectTypeRepository: {[key: string]: any} = {};

export function clearObjectTypeRepository() {
    objectTypeRepository = {};
}

export function objectTypeFactory(target: Function) {
    const objectTypeDef = Reflect.getMetadata("gq_object_type", target.prototype);
    const typeFromRepository = objectTypeRepository[objectTypeDef.name];
    if (typeFromRepository) {
        return typeFromRepository;
    }
    if (!Reflect.hasMetadata("gq_fields", target.prototype)) {
        throw new SchemaFactoryError("Class annotated @ObjectType() should has one or more fields annotated by @Filed()", SchemaFactoryErrorType.NO_FIELD);
    }
    const fieldMetadataList = Reflect.getMetadata("gq_fields", target.prototype) as FieldTypeMetadata[];
    const fields: {[key: string]: any} = {};
    fieldMetadataList.forEach(def => {
        fields[def.name] = fieldTypeFactory(target, def);
    });
    const ret = new graphql.GraphQLObjectType({
        name: objectTypeDef.name,
        fields,
    });
    objectTypeRepository[objectTypeDef.name] = ret;
    return ret;
}
