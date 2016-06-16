import "reflect-metadata";

export const GQ_OBJECT_METADATA_KEY = "gq_object_type";

export function Query(option?: any) {
    return (target: any, propertyKey: any) => {
        Reflect.defineMetadata("gq_query_key", propertyKey, target);
    };
}

export function Mutation() {
    return (target: any) => { };
}

export function ObjectType() {
    return (target: any) => {
        Reflect.defineMetadata(GQ_OBJECT_METADATA_KEY, {
            name: target.name + "Type"
        }, target.prototype);
    };
}

export interface FieldOpetion {
    type?: any;
}

export interface FieldTypeMetadata {
    name: string;
    isNonNull?: boolean;
    isList?: boolean;
    explicitType?: any;
}

function createOrSetFieldTypeMetadata(target: any, metadata: FieldTypeMetadata) {
    let fieldDefs: FieldTypeMetadata[];
    if (!Reflect.hasMetadata("gq_fields", target)) {
        fieldDefs = [];
        Reflect.defineMetadata("gq_fields", fieldDefs, target);
    } else {
        fieldDefs = Reflect.getMetadata("gq_fields", target);
    }
    const def = fieldDefs.find(def => def.name === metadata.name);
    if (!def) {
        fieldDefs.push(metadata);
    } else {
        Object.assign(def, metadata);
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

export function Arg() {
    return (target: any, key: string | symbol, index: number) => {
    };
}

export function Schema() {
    return (target: Function) => {
    };
}

