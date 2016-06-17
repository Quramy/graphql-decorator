import "reflect-metadata";

export const GQ_QUERY_KEY                   = "gq_query";
export const GQ_FIELDS_KEY                  = "gq_fields";
export const GQ_OBJECT_METADATA_KEY         = "gq_object_type";

export function Query(option?: any) {
    return (target: any, propertyKey: any) => {
        Reflect.defineMetadata(GQ_QUERY_KEY, propertyKey, target);
    };
}

export function Mutation() {
    return (target: any) => { };
}

export interface ObjectTypeMetadata {
    name: string;
    isInput: boolean;
}

export function ObjectType() {
    return (target: any) => {
        Reflect.defineMetadata(GQ_OBJECT_METADATA_KEY, {
            name: target.name,
            isInput: false,
        }, target.prototype);
    };
}

export function InputObjectType() {
    return (target: any) => {
        Reflect.defineMetadata(GQ_OBJECT_METADATA_KEY, {
            name: target.name,
            isInput: true,
        }, target.prototype);
    };
}

export interface FieldOpetion {
    type?: any;
}

export interface ArgumentOption {
    name: string;
    type?: any;
}

export interface TypeMetadata {
    name: string;
    isNonNull?: boolean;
    isList?: boolean;
    explicitType?: any;
}

export interface ArgumentMetadata extends TypeMetadata {
}

export interface FieldTypeMetadata extends ArgumentMetadata {
    args?: ArgumentMetadata[];
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

export function Field(option?: FieldOpetion) {
    return (target: any, propertyKey: any) => {
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            explicitType: option && option.type,
        });
    };
}

export function NonNull() {
    return (target: any, propertyKey: any) => {
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            isNonNull: true,
        });
    };
}

export function List() {
    return (target: any, propertyKey: any) => {
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            isList: true,
        });
    };
}

export function Arg(option: ArgumentOption) {
    return (target: any, propertyKey: any, index: number) => {
        const args: ArgumentMetadata[] = [];
        args[index] = {
            name: option.name,
            explicitType: option.type,
        };
        createOrSetFieldTypeMetadata(target, {
            name: propertyKey,
            args,
        });
    };
}

export function Schema() {
    return (target: Function) => {
        Reflect.defineMetadata("gq_schema", {}, target);
    };
}
