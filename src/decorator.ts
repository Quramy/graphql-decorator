import 'reflect-metadata';
import { OrderByTypeFactory } from './order-by.type-factory';
import { GraphQLType } from 'graphql';
import * as graphql from 'graphql';
import { IoCContainer } from './ioc-container';
import { PaginationResponse } from './pagination.type';
import { PageInfo } from './page-info.type';

export const GQ_QUERY_KEY = 'gq_query';
export const GQ_MUTATION_KEY = 'gq_mutation';
export const GQ_FIELDS_KEY = 'gq_fields';
export const GQ_VALUES_KEY = 'gq_values';
export const GQ_OBJECT_METADATA_KEY = 'gq_object_type';
export const GQ_ENUM_METADATA_KEY = 'gq_enum_type';
export const GQ_DESCRIPTION_KEY = 'gq_description';



export interface TypeMetadata {
    name?: string;
    description?: string;
    isNonNull?: boolean;
    isList?: boolean;
    isPagination?: boolean;
    explicitType?: any;
}

export interface ArgumentMetadata extends TypeMetadata {
    index?: number;
}

export interface ContextMetadata extends ArgumentMetadata {
    index?: number;
}

export interface RootMetadata extends ContextMetadata {
}

export interface FieldTypeMetadata extends RootMetadata {
    args?: ArgumentMetadata[];
    root?: RootMetadata;
    context?: ContextMetadata;
}

export interface ObjectTypeMetadata {
    name?: string;
    description?: string;
    isInput?: boolean;
}

export interface EnumTypeMetadata {
    name?: string;
    description?: string;
    values?: EnumValueMetadata[];
}

export interface EnumValueMetadata {
    name: string;
    value?: any;
    description?: string;
}

export interface FieldOption {
    type?: any;
}

export interface ArgumentOption {
    name: string;
    type?: any;
}

export interface DescriptionMetadata {
    description: string;
}

export interface PropertyDescriptionMetadata extends DescriptionMetadata {
    name: string;
}

function mergeDescriptionMetadata(target: any, sourceMetadata: any): any {
    if (target.prototype != null && Reflect.hasMetadata(GQ_DESCRIPTION_KEY, target.prototype)) {
        let descriptionMetadata = Reflect.getMetadata(GQ_DESCRIPTION_KEY, target.prototype);
        sourceMetadata = Object.assign(sourceMetadata, descriptionMetadata);
    }

    return sourceMetadata;
}

function createOrSetObjectTypeMetadata(target: any, metadata: ObjectTypeMetadata) {
    if (!Reflect.hasMetadata(GQ_OBJECT_METADATA_KEY, target.prototype)) {
        let mergedMetadata = mergeDescriptionMetadata(target, metadata);
        Reflect.defineMetadata(GQ_OBJECT_METADATA_KEY, mergedMetadata, target.prototype);
    } else {
        const originalMetadata = Reflect.getMetadata(GQ_OBJECT_METADATA_KEY, target.prototype) as ObjectTypeMetadata;
        Object.assign(originalMetadata, metadata);
    }
}

function createOrSetEnumTypeMetadata(target: any, metadata: EnumTypeMetadata) {
    if (!Reflect.hasMetadata(GQ_ENUM_METADATA_KEY, target.prototype)) {
        let mergedMetadata = mergeDescriptionMetadata(target, metadata);
        Reflect.defineMetadata(GQ_ENUM_METADATA_KEY, mergedMetadata, target.prototype);
    } else {
        const originalMetadata = Reflect.getMetadata(GQ_ENUM_METADATA_KEY, target.prototype) as EnumTypeMetadata;
        Object.assign(originalMetadata, metadata);
    }
}

function createOrSetValueTypeMetadata(target: any, metadata: EnumValueMetadata) {
    let valueDefs: EnumValueMetadata[];
    if (!Reflect.hasMetadata(GQ_VALUES_KEY, target)) {
        valueDefs = [];
        Reflect.defineMetadata(GQ_VALUES_KEY, valueDefs, target);
    } else {
        valueDefs = Reflect.getMetadata(GQ_VALUES_KEY, target);
    }
    const def = valueDefs.find(def => def.name === metadata.name);
    if (!def) {
        let propertyDescriptionMetadata = getPropertyDescriptionMetadata(target, metadata.name);
        Object.assign(metadata, propertyDescriptionMetadata);
        valueDefs.push(metadata);
    }
}

function createOrSetFieldTypeMetadata(target: any, metadata: FieldTypeMetadata) {
    let fieldDefs: FieldTypeMetadata[];
    if (!Reflect.hasMetadata(GQ_FIELDS_KEY, target)) {
        fieldDefs = [];
        Reflect.defineMetadata(GQ_FIELDS_KEY, fieldDefs, target);
    } else {
        fieldDefs = Reflect.getMetadata(GQ_FIELDS_KEY, target);
    }
    const def = fieldDefs.find(def => def.name === metadata.name);
    if (!def) {
        let propertyDescriptionMetadata = getPropertyDescriptionMetadata(target, metadata.name);
        Object.assign(metadata, propertyDescriptionMetadata);
        fieldDefs.push(metadata);
    } else {
        let args: ArgumentMetadata[] = def.args;
        if (metadata.args && metadata.args.length) {
            if (!def.args) {
                args = metadata.args;
            } else {
                args = Object.assign([], def.args, metadata.args);
            }
        }
        Object.assign(def, metadata);
        def.args = args;
    }

}

function createDescriptionMetadata(target: any, body: string) {
    let metadata = {
        description: body,
    };
    Reflect.defineMetadata(GQ_DESCRIPTION_KEY, metadata, target.prototype);
}

function createPropertyDescriptionMetadata(target: any, body: string, propertyKey: string) {
    let metadata = {
        name: propertyKey,
        description: body,
    };
    Reflect.defineMetadata(propertyKey, metadata, target);
}

export function getPropertyDescriptionMetadata(target: any, name: string) {
    if (!Reflect.hasMetadata(name, target)) {
        return null;
    }
    return (<PropertyDescriptionMetadata>Reflect.getMetadata(name, target));
}

export function getFieldMetadata(target: any, name: string) {
    if (!Reflect.hasMetadata(GQ_FIELDS_KEY, target)) {
        return null;
    }
    return (<FieldTypeMetadata[]>Reflect.getMetadata(GQ_FIELDS_KEY, target)).find(m => m.name === name);
}

export function getValueMetadata(target: any, name: string) {
    if (!Reflect.hasMetadata(GQ_VALUES_KEY, target)) {
        return null;
    }
    return (<EnumValueMetadata[]>Reflect.getMetadata(GQ_VALUES_KEY, target)).find(m => m.name === name);
}

function setArgumentMetadata(target: any, propertyKey: any, index: number, metadata: ArgumentMetadata) {
    const fieldMetadata = getFieldMetadata(target, propertyKey);
    if (fieldMetadata && fieldMetadata.args && fieldMetadata.args[index]) {
        Object.assign(fieldMetadata.args[index], metadata);
    } else {
        const args: ArgumentMetadata[] = [];
        args[index] = metadata;
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            args,
        });
    }
}

function setContextMetadata(target: any, propertyKey: any, index: number, metadata: ContextMetadata) {
    const fieldMetadata = getFieldMetadata(target, propertyKey);
    if (fieldMetadata && fieldMetadata.context) {
        Object.assign(fieldMetadata.context, true);
    } else {
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            context: { index: index },
        });
    }
}

function setRootMetadata(target: any, propertyKey: any, index: number, metadata: ContextMetadata) {
    const fieldMetadata = getFieldMetadata(target, propertyKey);
    if (fieldMetadata && fieldMetadata.root) {
        Object.assign(fieldMetadata.root, metadata);
    } else {
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            root: { index: index },
        });
    }
}

export function EnumType() {
    return function (target: any) {
        createOrSetEnumTypeMetadata(target, {
            name: target.name,
        });
    } as Function;
}

export function ObjectType() {
    return function (target: any) {
        createOrSetObjectTypeMetadata(target, {
            name: target.name,
            isInput: false,
        });
    } as Function;
}

export function InputObjectType() {
    return function (target: any) {
        createOrSetObjectTypeMetadata(target, {
            name: target.name,
            isInput: true,
        });
    } as Function;
}

export function Field(option?: FieldOption) {
    return function (target: any, propertyKey: any) {
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            explicitType: option && option.type,
        });
    } as Function;
}

export function Value(value?: any) {
    return function (target: any, propertyKey: any) {
        createOrSetValueTypeMetadata(target, {
            name: propertyKey,
            value: value,
        });
    } as Function;
}

export function NonNull() {
    return function (target: any, propertyKey: any, index?: number) {
        if (index >= 0) {
            setArgumentMetadata(target, propertyKey, index, {
                isNonNull: true,
            });
        } else {
            createOrSetFieldTypeMetadata(target, {
                name: propertyKey,
                isNonNull: true,
            });
        }
    } as Function;
}

export function Pagination() {
    return function (target: any, propertyKey: any, methodDescriptor: any) {

        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            isPagination: true,
        });

        let originalMethod = methodDescriptor.value;

        return {
            value: async function (...args: any[]) {
                let [data, count] = await originalMethod.apply(this, args);

                let metadata: FieldTypeMetadata = Reflect.getMetadata(GQ_FIELDS_KEY, target)[0];
                let indexMap: { [name: string]: number; } = {};
                metadata.args.forEach((arg: ArgumentMetadata) => {
                    indexMap[arg.name] = arg.index;
                });

                let limit = args[indexMap['limit']];
                let offset = args[indexMap['offset']];

                return new PaginationResponse(count, data, new PageInfo(count, offset, limit));
            },
        };
    } as Function;
}

export function List() {
    return function (target: any, propertyKey: any, index?: number) {
        if (index >= 0) {
            setArgumentMetadata(target, propertyKey, index, {
                isList: true,
            });
        } else {
            createOrSetFieldTypeMetadata(target, {
                name: propertyKey,
                isList: true,
            });
        }
    } as Function;
}

export function Arg(option: ArgumentOption) {
    return function (target: any, propertyKey: any, index: number) {
        setArgumentMetadata(target, propertyKey, index, {
            name: option.name,
            explicitType: option.type,
            index: index,
        });
    } as Function;
}

export function Root() {
    return function (target: any, propertyKey: any, index: number) {
        setRootMetadata(target, propertyKey, index, {});
    } as Function;
}

export function Ctx() {
    return function (target: any, propertyKey: any, index: number) {
        setContextMetadata(target, propertyKey, index, {});
    } as Function;
}

export function OrderBy() {
    return function (target: any, propertyKey: any, index: number) {
        setArgumentMetadata(target, propertyKey, index, {
            name: 'orderBy',
        });
    } as Function;
}

export function Description(body: string) {
    return function (target: any, propertyKey?: any, index?: number) {
        if (index >= 0) {
            setArgumentMetadata(target, propertyKey, index, {
                description: body,
            });
        } else if (propertyKey) {
            if (getFieldMetadata(target, propertyKey) != null) {
                createOrSetFieldTypeMetadata(target, {
                    name: propertyKey,
                    description: body,
                });
            } else if (getValueMetadata(target, propertyKey) != null) {
                createOrSetValueTypeMetadata(target, {
                    name: propertyKey,
                    description: body,
                });
            } else {
                createPropertyDescriptionMetadata(target, body, propertyKey);
            }
        } else {
            if (Reflect.hasMetadata(GQ_OBJECT_METADATA_KEY, target.prototype)) {
                createOrSetObjectTypeMetadata(target, {
                    description: body,
                });
            } else if (Reflect.hasMetadata(GQ_ENUM_METADATA_KEY, target.prototype)) {
                createOrSetEnumTypeMetadata(target, {
                    description: body,
                });
            } else {
                createDescriptionMetadata(target, body);
            }
        }
    } as Function;
}

export function Query(option?: any) {
    return function (target: any, propertyKey: any) {
        if (Reflect.hasMetadata(GQ_QUERY_KEY, target)) {
            let metadata = Reflect.getMetadata(GQ_QUERY_KEY, target);
            metadata.push(propertyKey);
            Reflect.defineMetadata(GQ_QUERY_KEY, metadata, target);
        } else {
            Reflect.defineMetadata(GQ_QUERY_KEY, [propertyKey], target);
        }
    } as Function;
}

export function Mutation(option?: any) {
    return function (target: any, propertyKey: any) {
        if (Reflect.hasMetadata(GQ_MUTATION_KEY, target)) {
            let metadata = Reflect.getMetadata(GQ_MUTATION_KEY, target);
            metadata.push(propertyKey);
            Reflect.defineMetadata(GQ_MUTATION_KEY, metadata, target);
        } else {
            Reflect.defineMetadata(GQ_MUTATION_KEY, [propertyKey], target);
        }
    } as Function;
}

export function Schema() {
    return function (target: Function) {
        Reflect.defineMetadata('gq_schema', {}, target);
    } as Function;
}

export function UseContainer(container: any) {
    return function (target: Function) {
        IoCContainer.INSTANCE = container;
    };
}

