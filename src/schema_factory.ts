import * as graphql from 'graphql';

import { FieldTypeMetadata, GQ_FIELDS_KEY, GQ_MUTATION_KEY, GQ_OBJECT_METADATA_KEY, GQ_QUERY_KEY, GQ_SUBSCRIPTION_KEY } from './decorator';
import { mutationObjectTypeFactory, queryObjectTypeFactory, subscriptionObjectTypeFactory } from './object_type_factory';

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { fieldTypeFactory } from './field_type_factory';

export enum SchemaFactoryErrorType {
    NO_SCHEMA_ANNOTATION,
    NO_QUERY_FIELD,
    NO_FIELD,
    NO_VALUE,
    NO_TYPE_ORDERBY_PARENT_FIELD,
    INVALID_OBJECT_TYPE_METADATA,
    INPUT_FIELD_SHOULD_NOT_BE_FUNC,
    VALUE_SHOULD_NOT_BE_FUNC,
    ORDER_BY_OUTSIDE_PAGINATION,
}

function getRootObject(
    target: Function,
    metadataKey: string,
    mandatory: boolean,
    objectTypeFactory: (fieldsDict: any) => GraphQLObjectType,
    isSubscription?: boolean,
) {

    if (mandatory && !Reflect.hasMetadata(metadataKey, target.prototype)) {
        throw new SchemaFactoryError('Target should has @Query field', SchemaFactoryErrorType.NO_QUERY_FIELD);
    }

    let rootObject: any;
    if (Reflect.hasMetadata(metadataKey, target.prototype)) {
        const metadata = Reflect.getMetadata(metadataKey, target.prototype);
        const fields: { [key: string]: any } = {};
        let typeFn: Function;
        let fieldMetadataList: FieldTypeMetadata[];

        metadata.forEach((key: any) => {
            typeFn = Reflect.getMetadata('design:type', target.prototype, key) as Function;
            fieldMetadataList = Reflect.getMetadata(GQ_FIELDS_KEY, typeFn.prototype) as FieldTypeMetadata[];
            fieldMetadataList.forEach(def => {
                fields[def.name] = fieldTypeFactory(typeFn, def, undefined, isSubscription);
            });
        });

        rootObject = objectTypeFactory(fields);
    }

    return rootObject;
}

export class SchemaFactoryError extends Error {
    constructor(msg: string, public type: SchemaFactoryErrorType) {
        super(msg);
        this.message = msg;
    }
}

export function schemaFactory(target: Function) {
    if (!Reflect.hasMetadata('gq_schema', target)) {
        // tslint:disable-next-line:max-line-length
        throw new SchemaFactoryError('The argument of schemaFactory should be annotated @Schema() decorator', SchemaFactoryErrorType.NO_SCHEMA_ANNOTATION);
    }

    let rootQueryObject = getRootObject(target, GQ_QUERY_KEY, true, queryObjectTypeFactory);
    let rootMutationObject = getRootObject(target, GQ_MUTATION_KEY, false, mutationObjectTypeFactory);
    let rootSubscriptionObject = getRootObject(target, GQ_SUBSCRIPTION_KEY, false, subscriptionObjectTypeFactory, true);

    return new graphql.GraphQLSchema({
        query: rootQueryObject,
        mutation: rootMutationObject,
        subscription: rootSubscriptionObject,
    });
}
