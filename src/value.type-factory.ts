import { EnumValueMetadata } from './decorator';
import { enumTypeFactory } from './enum.type-factory';
import { SchemaFactoryError , SchemaFactoryErrorType } from './schema_factory';

export function valueTypeFactory(target: Function, metadata: EnumValueMetadata): any {
    let description = metadata.description;
    let value = metadata.value;
    let isFunctionType = Reflect.getMetadata('design:type', target.prototype, metadata.name) === Function;
    let valueType;

    if (isFunctionType) {
        throw new SchemaFactoryError('Value declared in a class annotated by @EnumType should not be a function',
            SchemaFactoryErrorType.VALUE_SHOULD_NOT_BE_FUNC);
    }

    if (value != null) {
        valueType = {
            value: value,
            description: description,
        };
    } else {
        valueType = {
            description: description,
        };
    }

    return valueType;
}
