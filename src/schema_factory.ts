import { FieldTypeMetadata } from "./decorator";
const graphql = require("graphql");

export function fieldTypeFactory(target: Function, metadata: FieldTypeMetadata) {
    let fieldType: any, resolveFn: Function;
    let typeFn: Function, isFunctionType: boolean;
    typeFn = Reflect.getMetadata("design:type", target.prototype, metadata.name) as Function;
    isFunctionType = Reflect.getMetadata("design:type", target.prototype, metadata.name) === Function;
    if (!metadata.explicitType) {
        if (isFunctionType) {
            typeFn = Reflect.getMetadata("design:returntype", target.prototype, metadata.name) as Function;
            resolveFn = target.prototype[metadata.name];
        }
        if (typeFn === Number) {
            fieldType = graphql.GraphQLInt;     // FIXME or float?
        } else if (typeFn === String) {
             fieldType = graphql.GraphQLString;
        } else if (typeFn === Boolean) {
             fieldType = graphql.GraphQLBoolean;
        } else if (typeFn && typeFn.prototype && Reflect.hasMetadata("gq_object_type", typeFn.prototype)) {
            fieldType = objectTypeFactory(typeFn);
        }
    } else {
        fieldType = metadata.explicitType;
        if (fieldType && fieldType.prototype && Reflect.hasMetadata("gq_object_type", fieldType.prototype)) {
            fieldType = objectTypeFactory(fieldType);
        }
        if (isFunctionType) {
            resolveFn = target.prototype[metadata.name];
        }
    }
    if (!fieldType) return null;
    if (metadata.isList) {
        fieldType = new graphql.GraphQLList(fieldType);
    }
    if (metadata.isNonNull) {
        fieldType = new graphql.GraphQLNonNull(fieldType);
    }
    return {
        type: fieldType,
        resolve: resolveFn,
    };
}

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

export enum SchemaFactoryErrorType {
    NO_QUERY_FIELD,
    NO_FIELD,
}

export class SchemaFactoryError extends Error {
    constructor(msg: string, public type: SchemaFactoryErrorType) {
        super(msg);
        this.message = msg;
    }
}

export function schemaFactory(target: Function) {

    if (!Reflect.hasMetadata("gq_query_key", target.prototype)) {
        throw new SchemaFactoryError("Target should has @Query field", SchemaFactoryErrorType.NO_QUERY_FIELD);
    }

    const queryKey = Reflect.getMetadata("gq_query_key", target.prototype) as string;
    const queryTypeFn = Reflect.getMetadata("design:type", target.prototype, queryKey) as Function;
    const ret = new graphql.GraphQLSchema({
        query: objectTypeFactory(queryTypeFn),
    });

    return ret;
}
