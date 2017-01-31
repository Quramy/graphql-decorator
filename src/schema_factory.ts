import { FieldTypeMetadata , GQ_QUERY_KEY , GQ_MUTATION_KEY, GQ_FIELDS_KEY } from "./decorator";
import { mutationObjectTypeFactory, queryObjectTypeFactory, objectTypeFactory } from "./object_type_factory";
import { fieldTypeFactory } from "./field_type_factory";
const graphql = require("graphql");

export enum SchemaFactoryErrorType {
    NO_SCHEMA_ANNOTATION,
    NO_QUERY_FIELD,
    NO_FIELD,
    INVALID_OBJECT_TYPE_METADATA,
    INPUT_FIELD_SHOULD_NOT_BE_FUNC,
}

export class SchemaFactoryError extends Error {
    constructor(msg: string, public type: SchemaFactoryErrorType) {
        super(msg);
        this.message = msg;
    }
}

export function schemaFactory(target: Function) {
    if (!Reflect.hasMetadata("gq_schema", target)) {
        throw new SchemaFactoryError("The argument of schemaFactory should be annotated @Schema() decorator", SchemaFactoryErrorType.NO_SCHEMA_ANNOTATION);
    }

    let queryFieldsDict: any = {};
    var rootQueryObject: any;
    if (!Reflect.hasMetadata(GQ_QUERY_KEY, target.prototype)) {
        throw new SchemaFactoryError("Target should has @Query field", SchemaFactoryErrorType.NO_QUERY_FIELD);
    } else {
        const queryMetadata = Reflect.getMetadata(GQ_QUERY_KEY, target.prototype);
        const queryFields: {[key: string]: any} = {};
        var queryTypeFn: Function;
        var queryFieldMetadataList: FieldTypeMetadata[];

        queryMetadata.forEach((queryKey: any) => {
            queryTypeFn = Reflect.getMetadata("design:type", target.prototype, queryKey) as Function;
            queryFieldMetadataList = Reflect.getMetadata(GQ_FIELDS_KEY, queryTypeFn.prototype) as FieldTypeMetadata[];

            queryFieldMetadataList.forEach(def => {
                queryFields[def.name] = fieldTypeFactory(queryTypeFn, def);
            });
        });

        rootQueryObject = queryObjectTypeFactory(queryFields);
    }

    let mutationFieldsDict: any = {};
    if (!Reflect.hasMetadata(GQ_MUTATION_KEY, target.prototype)) {
        const ret = new graphql.GraphQLSchema({
            query: rootQueryObject,
        });
        return ret;
    } else {
        let mutationMetadata = Reflect.getMetadata(GQ_MUTATION_KEY, target.prototype);
        const fields: {[key: string]: any} = {};
        var mutationTypeFn: Function;
        var fieldMetadataList: FieldTypeMetadata[];
        
        mutationMetadata.forEach((mutationKey: any) => {
            mutationTypeFn = Reflect.getMetadata("design:type", target.prototype, mutationKey) as Function;
            fieldMetadataList = Reflect.getMetadata(GQ_FIELDS_KEY, mutationTypeFn.prototype) as FieldTypeMetadata[];

            fieldMetadataList.forEach(def => {
                fields[def.name] = fieldTypeFactory(mutationTypeFn, def);
            });
        });

        let rootMutationObject = mutationObjectTypeFactory(fields);

        return new graphql.GraphQLSchema({
            query: rootQueryObject,
            mutation: rootMutationObject
        });
    }
}
