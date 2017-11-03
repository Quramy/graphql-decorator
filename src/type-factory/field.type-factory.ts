import 'reflect-metadata';

import * as graphql from 'graphql';

import {
  ArgumentMetadata,
  FieldMetadata,
  OrderByMetadata,
} from '../metadata';
import { SchemaFactoryError, SchemaFactoryErrorType } from './schema.type-factory';

import { IoCContainer } from '../ioc-container';
import { Middleware } from '../middleware';
import { OrderByTypeFactory } from './order-by.type-factory';
import { PaginationType } from '../pagination.type';
import { enumTypeFactory } from './enum.type-factory';
import { getMetadataArgsStorage } from '../metadata-builder';
import { objectTypeFactory } from './object.type-factory';
import { unionTypeFactory } from './union.type-factory';

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

function convertType(typeFn: Function, metadata: FieldMetadata | ArgumentMetadata, isInput: boolean) {
    let returnType: any;

    if (!metadata.type) {
        if (typeFn === Number) {
            returnType = graphql.GraphQLInt;     // FIXME or float?
        } else if (typeFn === String) {
            returnType = graphql.GraphQLString;
        } else if (typeFn === Boolean) {
            returnType = graphql.GraphQLBoolean;
        } else if (typeFn && typeFn.prototype && getMetadataArgsStorage().filterObjectTypeByClass(typeFn).length > 0) {
          // recursively call objectFactory
          returnType = objectTypeFactory(typeFn, isInput);
        }
      } else {
        returnType = metadata.type;

        if (returnType && returnType.prototype && getMetadataArgsStorage().filterUnionTypeByClass(returnType).length > 0) {
            returnType = unionTypeFactory(returnType, isInput);
        } else if (returnType && returnType.prototype && getMetadataArgsStorage().filterObjectTypeByClass(returnType).length > 0) {
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
    if ((metadata as any).isPagination) { //TODO: organize functions/metadata better to avoid the need of this kind of hack
        returnType = PaginationType.build(metadata.name, returnType);
    }

    return returnType;

}

export function resolverFactory(
    target: Function,
    metadata: FieldMetadata,
    fieldParentClass?: any,
): ResolverHolder {
    const fieldArguments = Reflect.getMetadata('design:paramtypes', target.prototype, metadata.name) as Function[];
    const argumentConfigMap: { [name: string]: any; } = {};
    const indexMap: { [name: string]: number; } = {};

    if (metadata.context) {
      indexMap['context'] = metadata.context.index;
    }
    if (metadata.root) {
      indexMap['root'] = metadata.root.index;
    }

    if ((metadata.arguments && metadata.arguments.length > 0) || metadata.orderBy) {
      fieldArguments.forEach((paramFn, index) => {
          const argumentMetadata = (metadata.arguments.concat(metadata.orderBy))
            .filter(value => value)
            .find((value: ArgumentMetadata | OrderByMetadata) => value.index === index); //TODO: Can avoin O(n x m) here using a hash for arguments
          argumentConfigMap[argumentMetadata.name] = {
              name: argumentMetadata.name,
              type: convertType(paramFn, argumentMetadata, true),
          };
          indexMap[argumentMetadata.name] = index;
      });
    }

    const originalFn = (fieldParentClass ? fieldParentClass[metadata.name] as Function : null);
    const fn = !fieldParentClass ? null : function (root: any, args: { [name: string]: any; }, context: any, info: any) {
        const rest: any[] = [];
        // TODO inject info to rest arguments
        Object.keys(args || []).forEach(key => {
            const index = indexMap[key];
            if (index >= 0) {
                rest[index] = args[key];
            }
        });

        if (metadata.context) {
            const index = indexMap['context'];
            if (index >= 0) {
                rest[index] = context;
            }
        }

        if (metadata.root) {
            const index = indexMap['root'];
            if (index >= 0) {
                rest[index] = root;
            }
        }
        if (metadata.before) {

            // TODO: This whole chain should be promise based but this would impact the whole `schemaFactory` call chain.
            //  So Promise will be added as a future feature/enhancement
            let result: any = null;
            let next: (error?: Error) => void = (error?: Error, value?: any): any => {
                if (error) {
                    throw error;
                } else if (typeof (value) !== 'undefined') {
                    result = value;
                } else {
                    result = originalFn.apply(fieldParentClass, rest);
                }
            };
            metadata.before.middleware.call(fieldParentClass, context, args, next);
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

export function fieldTypeFactory(target: Function, metadata?: FieldMetadata, isInput: boolean = false, isSubscription: boolean = false) {
    if (!metadata) { return null; }

    let typeFn = Reflect.getMetadata('design:type', target.prototype, metadata.name) as Function;
    let resolveFn: Function, subscribeFn: Function, args: { [name: string]: any; };

    const instance = IoCContainer.INSTANCE != null ? IoCContainer.INSTANCE.get(target) : new (target as any);

    if (isInput && typeFn === Function) {
        // TODO write test
        throw new SchemaFactoryError('Field declared in a class annotated by @InputObjectType should not be a function',
            SchemaFactoryErrorType.INPUT_FIELD_SHOULD_NOT_BE_FUNC);
    } else if (typeFn === Function) {
        if (!metadata.type) {
            // infer type from function return type if no explicit type is provided
            typeFn = Reflect.getMetadata('design:returntype', target.prototype, metadata.name) as Function;
        }

        const resolverHolder = resolverFactory(target, metadata, instance);

        resolveFn = resolverHolder.fn;
        args = resolverHolder.argumentConfigMap;
    }

    if (isSubscription) {

        if (!instance || !instance[metadata.name] || !instance[metadata.name].subscribe)
            throw new Error(`invalid subscription object: '${metadata.name}'`);

        subscribeFn = instance[metadata.name].subscribe;
    }

    const fieldType = convertType(typeFn, metadata, isInput);

    args = OrderByTypeFactory.orderByFactory(metadata, args);

    if (!fieldType) return null;

    return {
        type: fieldType,
        description: metadata.description,
        args: args,
        resolve: resolveFn,
        subscribe: subscribeFn,
    };
}
