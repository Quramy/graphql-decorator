import { FieldTypeMetadata , RootMetadata, ArgumentMetadata, ContextMetadata,  
    GQ_OBJECT_METADATA_KEY , TypeMetadata } from "./decorator";
import { objectTypeFactory } from "./object_type_factory";
import { SchemaFactoryError , SchemaFactoryErrorType } from "./schema_factory";
const graphql = require("graphql");

export interface ResolverHolder {
    fn: Function;
    argumentConfigMap: {[name: string]: any; };
}

function convertType(typeFn: Function, metadata: TypeMetadata, isInput: boolean) {
    let returnType: any;
    if (!metadata.explicitType) {
        if (typeFn === Number) {
            returnType = graphql.GraphQLInt;     // FIXME or float?
        } else if (typeFn === String) {
             returnType = graphql.GraphQLString;
        } else if (typeFn === Boolean) {
             returnType = graphql.GraphQLBoolean;
        } else if (typeFn && typeFn.prototype && Reflect.hasMetadata(GQ_OBJECT_METADATA_KEY, typeFn.prototype)) {
            // recursively call objectFactory
            returnType = objectTypeFactory(typeFn, isInput);
        }
    } else {
        returnType = metadata.explicitType;
        if (returnType && returnType.prototype && Reflect.hasMetadata(GQ_OBJECT_METADATA_KEY, returnType.prototype)) {
            // recursively call objectFactory
            returnType = objectTypeFactory(returnType, isInput);
        }
    }
    if (!returnType) return null;
    if (metadata.isList) {
        returnType = new graphql.GraphQLList(returnType);
    }
    if (metadata.isNonNull) {
        returnType = new graphql.GraphQLNonNull(returnType);
    }
    return returnType;
}

export function resolverFactory(target: Function, name: string, argumentMetadataList: ArgumentMetadata[],
    hasContext?: boolean, hasRoot?: boolean, rootMetadata?: RootMetadata, contextMetadata?: ContextMetadata): ResolverHolder {
    const params = Reflect.getMetadata("design:paramtypes", target.prototype, name) as Function[];
    const argumentConfigMap: {[name: string]: any; } = {};
    const indexMap: {[name: string]: number; } = {};

    params.forEach((paramFn, index) => {
        if (argumentMetadataList == null || argumentMetadataList[index] == null) {
            if (hasContext && hasRoot) {
                console.log(contextMetadata)
                console.log(rootMetadata)
                indexMap["context"] = contextMetadata.index;
                indexMap["root"] = rootMetadata.index;
            } else if (hasContext) {
                indexMap["context"] = index;
            } else if (hasRoot) {
                indexMap["root"] = index;
            }
        } else {
            const metadata = argumentMetadataList[index];

            argumentConfigMap[metadata.name] = {
                name: metadata.name,
                type: convertType(paramFn, metadata, true),
            };
            indexMap[metadata.name] = index;
        }
    });
    const originalFn = target.prototype[name] as Function;
    const fn = function(root: any, args: {[name: string]: any; }, context: any, info: any) {
        const rest: any[] = [];
        // TODO inject info to rest arguments
        Object.keys(args).forEach(name => {
            const index = indexMap[name];
            if (index >= 0) {
                rest[index] = args[name];
            }
        });

        if (hasContext) {
            const index = indexMap["context"];
            if (index >= 0) {
                rest[index] = context;
            }
        }

        if (hasRoot) {
            const index = indexMap["root"]
            if (index >= 0) {
                rest[index] = root;
            }
        }

        return originalFn.apply(target.prototype, rest);
    };
    return {
        fn, argumentConfigMap,
    };
}

export function fieldTypeFactory(target: Function, metadata: FieldTypeMetadata, isInput?: boolean) {
    let typeFn = Reflect.getMetadata("design:type", target.prototype, metadata.name) as Function;
    let resolveFn: Function, args: {[name: string]: any; };

    const description = metadata.description;
    const isFunctionType = Reflect.getMetadata("design:type", target.prototype, metadata.name) === Function;

    if (isInput && isFunctionType) {
        // TODO write test
        throw new SchemaFactoryError("Field declared in a class annotated by @InputObjectType should not be a function", SchemaFactoryErrorType.INPUT_FIELD_SHOULD_NOT_BE_FUNC);
    }

    if (isFunctionType) {
        if (!metadata.explicitType) {
            typeFn = Reflect.getMetadata("design:returntype", target.prototype, metadata.name) as Function;
        }
        const resolverHolder = resolverFactory(target, metadata.name, metadata.args, metadata.hasContext, metadata.hasRoot,
            metadata.root, metadata.context);
        resolveFn = resolverHolder.fn;
        args = resolverHolder.argumentConfigMap;
    }

    const fieldType = convertType(typeFn, metadata, isInput);
    if (!fieldType) return null;
    return {
        type: fieldType,
        description: description && description,
        args: args && args,
        resolve: resolveFn,
    };
}
