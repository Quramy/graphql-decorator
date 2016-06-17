import { FieldTypeMetadata , GQ_QUERY_KEY } from "./decorator";
import { objectTypeFactory } from "./object_type_factory";
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
    if (!Reflect.hasMetadata(GQ_QUERY_KEY, target.prototype)) {
        throw new SchemaFactoryError("Target should has @Query field", SchemaFactoryErrorType.NO_QUERY_FIELD);
    }
    const queryKey = Reflect.getMetadata(GQ_QUERY_KEY, target.prototype) as string;
    const queryTypeFn = Reflect.getMetadata("design:type", target.prototype, queryKey) as Function;
    const ret = new graphql.GraphQLSchema({
        query: objectTypeFactory(queryTypeFn),
    });
    return ret;
}
