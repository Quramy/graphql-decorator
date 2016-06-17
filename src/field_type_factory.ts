import { FieldTypeMetadata , ArgumentMetadata , GQ_OBJECT_INPUT_METADATA_KEY , GQ_OBJECT_METADATA_KEY } from "./decorator";
import { objectTypeFactory } from "./object_type_factory";
const graphql = require("graphql");

export function argumentFactory(paramFn: Function, metadata: ArgumentMetadata) {
    let argType: any;
    if (!metadata) {
        // TODO?
        return;
    }
    if (!metadata.explicitType) {
        if (paramFn === Number) {
            argType = graphql.GraphQLInt;     // FIXME or float?
        } else if (paramFn === String) {
            argType = graphql.GraphQLString;
        } else if (paramFn === Boolean) {
            argType = graphql.GraphQLBoolean;
        } else if (paramFn && Reflect.hasMetadata(GQ_OBJECT_INPUT_METADATA_KEY, paramFn.prototype)) {
            argType = inputObjectTypeFactory(paramFn);
        }
    }

    if (!argType) {
        // TODO
    }

    return {
        name: metadata.name,
        type: argType,
    };
}

// TODO
export function inputObjectTypeFactory(target: Function) {
}

export interface ResolverHolder {
    fn: Function;
    argumentConfigMap: {[name: string]: any; };
}

export function resolverFactory(target: Function, name: string, argumentMetadataList: ArgumentMetadata[]): ResolverHolder {
    const params = Reflect.getMetadata("design:paramtypes", target.prototype, name) as Function[];
    const argumentConfigMap: {[name: string]: any; } = {};
    const indexMap: {[name: string]: number; } = {};
    params.forEach((paramFn, index) => {
        const metadata = argumentMetadataList[index];
        argumentConfigMap[metadata.name] = argumentFactory(paramFn, metadata);
        indexMap[metadata.name] = index;
    });
    const originalFn = target.prototype[name] as Function;
    const fn = function(source: any, args: {[name: string]: any; }, context: any, info: any) {
        const rest: any[] = [];
        // TODO inject context and info to rest arguments
        Object.keys(args).forEach(name => {
            const index = indexMap[name];
            if (index >= 0) {
                rest[index] = args[name];
            }
        });
        return originalFn.apply(source, rest);
    };
    return {
        fn, argumentConfigMap,
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
            args = resolverHolder.argumentConfigMap;
        }
        if (typeFn === Number) {
            fieldType = graphql.GraphQLInt;     // FIXME or float?
        } else if (typeFn === String) {
             fieldType = graphql.GraphQLString;
        } else if (typeFn === Boolean) {
             fieldType = graphql.GraphQLBoolean;
        } else if (typeFn && typeFn.prototype && Reflect.hasMetadata(GQ_OBJECT_METADATA_KEY, typeFn.prototype)) {
            fieldType = objectTypeFactory(typeFn);
        }
    } else {
        fieldType = metadata.explicitType;
        if (fieldType && fieldType.prototype && Reflect.hasMetadata(GQ_OBJECT_METADATA_KEY, fieldType.prototype)) {
            fieldType = objectTypeFactory(fieldType);
        }
        if (isFunctionType) {
            const resolverHolder = resolverFactory(target, metadata.name, metadata.args);
            resolveFn = resolverHolder.fn;
            args = resolverHolder.argumentConfigMap;
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
