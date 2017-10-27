import { EnumValueMetadata, EnumTypeMetadata } from '../metadata';
import { SchemaFactoryError , SchemaFactoryErrorType } from './schema.type-factory';
import { enumValueTypeFactory } from './enum-value.type-factory';
import { GraphQLEnumType } from 'graphql';
import { getMetadataBuilder } from '../metadata-builder';

export function enumTypeFactory(target: any): any {

    const enumTypeMetadata = getMetadataBuilder()
      .buildEnumMetadata(target)
      .find((value, index) => index === 0);

    if (!enumTypeMetadata.values || enumTypeMetadata.values.length === 0) {
        throw new SchemaFactoryError('Class annotated by @EnumType() should has one or more fields annotated by @Value()',
        SchemaFactoryErrorType.NO_VALUE);
    }

    const values: {[key: string]: any} = {};
    enumTypeMetadata.values.forEach(def => {
        values[def.name] = enumValueTypeFactory(target, def);
    });

    return new GraphQLEnumType({
        name: enumTypeMetadata.name,
        description: enumTypeMetadata.description,
        values: values,
    });
}
