import * as graphql from 'graphql';

import {
    ArgumentMetadata,
    ContextMetadata,
    FieldTypeMetadata,
    GQ_FIELDS_KEY,
    GQ_OBJECT_METADATA_KEY,
    Middleware,
    RootMetadata,
    TypeMetadata,
} from './decorator';
import { getMetadataArgsStorage } from './metadata-builder';

import { SchemaFactoryError, SchemaFactoryErrorType } from './schema_factory';

import { IoCContainer } from './ioc-container';
import { OrderByTypeFactory } from './order-by.type-factory';
import { PaginationType } from './pagination.type';
import { objectTypeFactory } from './object_type_factory';
import { unionTypeFactory, enumTypeFactory } from './type-factory';


export interface ResolverHolder {
    fn: Function;
    argumentConfigMap: { [name: string]: any; };
}

let fieldTypeCache: { [key: string]: any} = {};

export function clearFieldTypeCache() {
  // remove all keys without losing reference
  Object.keys(fieldTypeCache)
    .forEach(key => delete fieldTypeCache[key]);
}

function convertType(typeFn: Function, metadata: TypeMetadata, isInput: boolean, name?: string) {
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

        if (returnType && returnType.prototype && getMetadataArgsStorage().filterUnionTypeByClass(returnType).length > 0) {
            returnType = unionTypeFactory(returnType, isInput);
        } else if (returnType && returnType.prototype && Reflect.hasMetadata(GQ_OBJECT_METADATA_KEY, returnType.prototype)) {
            // recursively call objectFactory
            returnType = objectTypeFactory(returnType, isInput);
        } else if (returnType && returnType.prototype && getMetadataArgsStorage().filterEnumsByClass(returnType).length > 0) {
            returnType = enumTypeFactory(returnType);
        }
    }

    if (!returnType) return null;

    // Avoid duplicated type names in schema
    //  An example of the error ocurring is using the same enum in several input or object fields
    //  Similar issue description at https://github.com/graphql/graphql-js/issues/146
    if (returnType.name && !fieldTypeCache[returnType.name]) {
      fieldTypeCache[returnType.name] = returnType;
    }
    returnType = fieldTypeCache[returnType.name] || returnType;

    if (metadata.isList) {
        returnType = new graphql.GraphQLList(returnType);
    }
    if (metadata.isNonNull) {
        returnType = new graphql.GraphQLNonNull(returnType);
    }
    if (metadata.isPagination) {
        returnType = PaginationType.build(name, returnType);
    }

    return returnType;

}

export function resolverFactory(
    target: Function,
    name: string,
    argumentMetadataList: ArgumentMetadata[],
    rootMetadata?: RootMetadata,
    contextMetadata?: ContextMetadata,
    fieldParentClass?: any,
    beforeMiddleware?: Middleware,
): ResolverHolder {
    const params = Reflect.getMetadata('design:paramtypes', target.prototype, name) as Function[];
    const argumentConfigMap: { [name: string]: any; } = {};
    const indexMap: { [name: string]: number; } = {};

    params.forEach((paramFn, index) => {
        if (argumentMetadataList == null || argumentMetadataList[index] == null) {
            if (contextMetadata) {
                indexMap['context'] = contextMetadata.index;
            }
            if (rootMetadata) {
                indexMap['root'] = rootMetadata.index;
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

    const originalFn = (fieldParentClass ? fieldParentClass[name] as Function : null);
    const fn = !fieldParentClass ? null : function (root: any, args: { [name: string]: any; }, context: any, info: any) {
        const rest: any[] = [];
        // TODO inject info to rest arguments
        Object.keys(args).forEach(key => {
            const index = indexMap[key];
            if (index >= 0) {
                rest[index] = args[key];
            }
        });

        if (contextMetadata) {
            const index = indexMap['context'];
            if (index >= 0) {
                rest[index] = context;
            }
        }

        if (rootMetadata) {
            const index = indexMap['root'];
            if (index >= 0) {
                rest[index] = root;
            }
        }
        if (beforeMiddleware) {

            // TODO: This whole chain should be promise based but this would impact the whole `schemaFactory` call chain.
            //  So Promise will be added as a future feature/enhancement
            let result: any = null;
            let next: (error?: Error) => void = (error?: Error, value?: any): any => {
                if (typeof (value) !== 'undefined') {
                    result = value;
                } else {
                    result = originalFn.apply(fieldParentClass, rest);
                }
            };
            beforeMiddleware.call(fieldParentClass, context, args, next);
            return result;
        } else {
            return originalFn.apply(fieldParentClass, rest);
        }
    };


    return {
        fn,
        argumentConfigMap,
    };
}

export function fieldTypeFactory(target: Function, metadata: FieldTypeMetadata, isInput?: boolean, isSubscription?: boolean) {
    let typeFn = Reflect.getMetadata('design:type', target.prototype, metadata.name) as Function;
    let resolveFn: Function, subscribeFn: Function, args: { [name: string]: any; };

    const description = metadata.description;
    const isFunctionType = Reflect.getMetadata('design:type', target.prototype, metadata.name) === Function;

    if (isInput && isFunctionType) {
        // TODO write test
        throw new SchemaFactoryError('Field declared in a class annotated by @InputObjectType should not be a function',
            SchemaFactoryErrorType.INPUT_FIELD_SHOULD_NOT_BE_FUNC);
    }

    if (isFunctionType) {
        if (!metadata.explicitType) {
            typeFn = Reflect.getMetadata('design:returntype', target.prototype, metadata.name) as Function;
        }

        let fieldParentClass;
        if (IoCContainer.INSTANCE != null) {
            fieldParentClass = IoCContainer.INSTANCE.get(target);
        } else {
            fieldParentClass = new (target as any);
        }

        const resolverHolder = resolverFactory(target,
            metadata.name,
            metadata.args,
            metadata.root,
            metadata.context,
            fieldParentClass,
            metadata.beforeMiddleware);



        resolveFn = resolverHolder.fn;

        args = resolverHolder.argumentConfigMap;
    }

    if (isSubscription) {
        const fieldParentClass = target as any;
        const instance = new fieldParentClass();

        if (!instance || !instance[metadata.name] || !instance[metadata.name].subscribe)
            throw new Error('invalid subscription object ' + metadata.name);

        subscribeFn = instance[metadata.name].subscribe;
    }

    const fieldType = convertType(typeFn, metadata, isInput, metadata.name);

    args = OrderByTypeFactory.orderByFactory(metadata, args);

    if (!fieldType) return null;

    return {
        type: fieldType,
        description: description && description,
        args: args && args,
        resolve: resolveFn,
        subscribe: subscribeFn,
    };
}
