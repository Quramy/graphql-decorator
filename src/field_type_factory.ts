import { FieldTypeMetadata , ArgumentMetadata } from "./decorator";
import { objectTypeFactory } from "./object_type_factory";
const graphql = require("graphql");

export function argumentFactory(paramFn: Function, metadata: ArgumentMetadata) {
    let argType: any;
    if (!metadata) {
        // TODO?
        return;
    }
    if (!metadata.explicitType) {
        argType = graphql.GraphQLInt;     // FIXME or float?
    } else {
        // TODO
    }

    if (!argType) {
        // TODO
    }

    return {
        name: metadata.name,
        type: argType,
    };
}

export interface ResolverHolder {
    fn: Function;
    args: {[name: string]: any; };
}

export function resolverFactory(target: Function, name: string, argumentMetadataList: ArgumentMetadata[]): ResolverHolder {
    const params = Reflect.getMetadata("design:paramtypes", target.prototype, name) as Function[];
    const args: {[name: string]: any; } = {};
    const indexMap: {[name: string]: number; } = {};
    params.forEach((paramFn, index) => {
        const metadata = argumentMetadataList[index];
        args[metadata.name] = argumentFactory(paramFn, metadata);
        indexMap[metadata.name] = index;
    });
    const originalFn = target.prototype[name] as Function;
    const fn = function(self: any, originalArgs: {[name: string]: any; }) {
        const rest: any[] = [];
        Object.keys(originalArgs).forEach(name => {
            const index = indexMap[name];
            if (index >= 0) {
                rest[index] = originalArgs[name];
            }
        });
        return originalFn.apply(self, rest);
    };
    return {
        fn, args,
    };
}

export function fieldTypeFactory(target: Function, metadata: FieldTypeMetadata) {
    let fieldType: any, resolveFn: Function, args: {[name: string]: any; };
    let typeFn: Function, isFunctionType: boolean;
    typeFn = Reflect.getMetadata("design:type", target.prototype, metadata.name) as Function;
    isFunctionType = Reflect.getMetadata("design:type", target.prototype, metadata.name) === Function;
    if (!metadata.explicitType) {
        if (isFunctionType) {
            typeFn = Reflect.getMetadata("design:returntype", target.prototype, metadata.name) as Function;
            const resolverHolder = resolverFactory(target, metadata.name, metadata.args);
            resolveFn = resolverHolder.fn;
            args = resolverHolder.args;
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
            const resolverHolder = resolverFactory(target, metadata.name, metadata.args);
            resolveFn = resolverHolder.fn;
            args = resolverHolder.args;
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
        args: args && args,
        resolve: resolveFn,
    };
}
