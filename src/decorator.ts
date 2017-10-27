import 'reflect-metadata';

import * as graphql from 'graphql';

import { GraphQLType } from 'graphql';
import { OrderByTypeFactory } from './order-by.type-factory';
import { PageInfo } from './page-info.type';
import { PaginationResponse } from './pagination.type';

export * from './decorator/';
export * from './metadata/options';

export const GQ_FIELDS_KEY = 'gq_fields';
export const GQ_DESCRIPTION_KEY = 'gq_description';

export interface TypeMetadata {
    name?: string;
    description?: string;
    isNonNull?: boolean;
    isList?: boolean;
    isPagination?: boolean;
    explicitType?: any;
    beforeMiddleware?: Middleware;
    extraParams?: any;
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

export interface DefaultOption {
    description?: string;
}

export interface FieldOption {
    type?: any;
    description?: string;
    nonNull?: boolean;
    isList?: boolean;
    pagination?: boolean;
}

export interface ArgumentOption extends DefaultOption {
    name: string;
    type?: any;
    nonNull?: boolean;
    isList?: boolean;
}

export interface SchemaOption extends DefaultOption {
    type?: any;
}


export interface DescriptionMetadata {
    description: string;
}

export interface PropertyDescriptionMetadata extends DescriptionMetadata {
    name: string;
}

export type Middleware = (context: any, args: { [key: string]: any }, next: (error?: Error, value?: any) => any) => Promise<any> | any;

function mergeDescriptionMetadata(target: any, sourceMetadata: any): any {
    if (target.prototype != null && Reflect.hasMetadata(GQ_DESCRIPTION_KEY, target.prototype)) {
        let descriptionMetadata = Reflect.getMetadata(GQ_DESCRIPTION_KEY, target.prototype);
        sourceMetadata = Object.assign(sourceMetadata, descriptionMetadata);
    }

    return sourceMetadata;
}

function createOrSetFieldTypeMetadata(target: any, metadata: FieldTypeMetadata) {
    let fieldDefs: FieldTypeMetadata[];
    if (!Reflect.hasMetadata(GQ_FIELDS_KEY, target)) {
        fieldDefs = [];
        Reflect.defineMetadata(GQ_FIELDS_KEY, fieldDefs, target);
    } else {
        fieldDefs = Reflect.getMetadata(GQ_FIELDS_KEY, target);
    }
    const def = fieldDefs.find(d => d.name === metadata.name);
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

function setDescriptionMetadata(description: string, target: any, propertyKey: string = undefined, index: number = undefined) {
    if (index >= 0) {
        setArgumentMetadata(target, propertyKey, index, {
            description: description,
        });
    } else if (propertyKey) {
        if (getFieldMetadata(target, propertyKey) != null) {
            createOrSetFieldTypeMetadata(target, {
                name: propertyKey,
                description: description,
            });
        } else {
            createPropertyDescriptionMetadata(target, description, propertyKey);
        }
    } else {
        createDescriptionMetadata(target, description);
    }
}

function setNonNullMetadata(target: any, propertyKey: string, index: number = undefined) {
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
}

function setPaginationMetadata(target: any, propertyKey: string, methodDescriptor: TypedPropertyDescriptor<any>) {

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
}

export function Field(option?: FieldOption) {
    return function (target: any, propertyKey: any, methodDescriptor?: any) {
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            explicitType: option && option.type,
        });

        if (option) {
            // description
            if (option.description) {
                setDescriptionMetadata(option.description, target, propertyKey);
            }

            // nonNull
            if (option.nonNull) {
                setNonNullMetadata(target, propertyKey);
            }

            // isList
            if (option.isList) {
                const index = methodDescriptor;
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
            }

            // pagination
            if (option.pagination) {
                if (!methodDescriptor || !methodDescriptor.value) {
                    console.warn('Field can\'t be pagination enabled', propertyKey);
                    return;
                }
                return setPaginationMetadata(target, propertyKey, methodDescriptor);
            }
        }

    } as Function;
}

export function NonNull() {
    return function (target: any, propertyKey: any, index?: number) {
        setNonNullMetadata(target, propertyKey, index);
    } as Function;
}

export function Before(middleware: Middleware) {
    return function (target: any, propertyKey: any, index?: number) {
        if (index >= 0) {
            setArgumentMetadata(target, propertyKey, index, {
                beforeMiddleware: middleware,
            });
        } else {
            createOrSetFieldTypeMetadata(target, {
                name: propertyKey,
                beforeMiddleware: middleware,
            });
        }
    } as Function;
}

export function Pagination() {
    return function (target: any, propertyKey: any, methodDescriptor: any) {

        return setPaginationMetadata(target, propertyKey, methodDescriptor);

    } as Function;
}

export function List(option?: DefaultOption) {
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

        if (option) {
            // description
            if (option.description) {
                setDescriptionMetadata(option.description, target, propertyKey, index);
            }
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

        if (option) {
            // description
            if (option.description) {
                setDescriptionMetadata(option.description, target, propertyKey, index);
            }

            // nonNull
            if (option.nonNull) {
                setNonNullMetadata(target, propertyKey, index);
            }

            // isList
            if (option.isList) {
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
          }
        }
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

export function OrderBy(params?: { extraColumns: string[], shouldIgnoreSchemaFields?: boolean } | string[]) {
    return function (target: any, propertyKey: any, index: number) {
        setArgumentMetadata(target, propertyKey, index, {
            name: 'orderBy',
            extraParams: (params && params.constructor === Array) ? { extraColumns: params } : params,
        });
    } as Function;
}

export function Description(body: string) {
    return function (target: any, propertyKey?: any, index?: number) {
        setDescriptionMetadata(body, target, propertyKey, index);
    } as Function;
}

