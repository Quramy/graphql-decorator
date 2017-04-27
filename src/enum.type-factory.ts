import { EnumValueMetadata , GQ_ENUM_METADATA_KEY , GQ_VALUES_KEY, EnumTypeMetadata } from './decorator';
import { SchemaFactoryError , SchemaFactoryErrorType } from './schema_factory';
import { valueTypeFactory } from './value.type-factory';
import { GraphQLEnumType } from 'graphql';

let objectTypeRepository: {[key: string]: any} = {};

export function clearObjectTypeRepository() {
    objectTypeRepository = {};
}

export function enumTypeFactory(target: Function): any {
    const enumTypeMetadata = Reflect.getMetadata(GQ_ENUM_METADATA_KEY, target.prototype) as EnumTypeMetadata;

    if (!Reflect.hasMetadata(GQ_VALUES_KEY, target.prototype)) {
        throw new SchemaFactoryError('Class annotated by @EnumType() should has one or more fields annotated by @Value()',
        SchemaFactoryErrorType.NO_VALUE);
    }

    const valueMetadataList = Reflect.getMetadata(GQ_VALUES_KEY, target.prototype) as EnumValueMetadata[];

    const values: {[key: string]: any} = {};
    valueMetadataList.forEach(def => {
        values[def.name] = valueTypeFactory(target, def);
    });

    return new GraphQLEnumType({
        name: enumTypeMetadata.name,
        description: enumTypeMetadata.description,
        values: values,
    });
}
