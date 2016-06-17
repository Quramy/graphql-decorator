import { FieldTypeMetadata } from "./decorator";
import { objectTypeFactory } from "./object_type_factory";
const graphql = require("graphql");

export enum SchemaFactoryErrorType {
    NO_SCHEMA_ANNOTATION,
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
    if (!Reflect.hasMetadata("gq_schema", target)) {
        throw new SchemaFactoryError("The argument of schemaFactory should be annotated @Schema() decorator", SchemaFactoryErrorType.NO_SCHEMA_ANNOTATION);
    }
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
