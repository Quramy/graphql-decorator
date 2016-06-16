import { FieldTypeMetadata } from "./decorator";
import { objectTypeFactory } from "./object_type_factory";
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
