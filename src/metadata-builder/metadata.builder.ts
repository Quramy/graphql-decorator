import {
  EnumTypeMetadata,
  EnumValueMetadata,
  UnionTypeMetadata,
  ObjectTypeMetadata,
} from '../metadata/types';

import { getMetadataArgsStorage } from './metadata-args.storage';

/**
 * Gets metadata builder
 * Metadata builder follows the best practices and stores metadata in a global variable.
 */
export function getMetadataBuilder(): MetadataBuilder {
  if (!(global as any).graphqlSchemaMetadataBuilder) {
      (global as any).graphqlSchemaMetadataBuilder = new MetadataBuilder();
  }

  return (global as any).graphqlSchemaMetadataBuilder;
}

export class MetadataBuilder {

  buildEnumMetadata(target: any): EnumTypeMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterEnumsByClass(target)
      .map(enumArg => ({
        target: enumArg.target,
        name: enumArg.name,
        description: enumArg.description,
        values: this.buildEnumValueMetadata(target),
      }));
  }

  buildUnionTypeMetadata(target: any): UnionTypeMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterUnionTypeByClass(target)
      .map(unionArg => ({
        target: unionArg.target,
        name: unionArg.name,
        resolver: unionArg.resolver,
        types: unionArg.types,
        description: unionArg.description,
      }));
  }

  buildObjectTypeMetadata(target: any): ObjectTypeMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterObjectTypeByClass(target)
      .map(objectArg => ({
        target: objectArg.target,
        name: objectArg.name,
        description: objectArg.description,
        isInput: objectArg.isInput,
      }));
  }

  protected buildEnumValueMetadata(target: any): EnumValueMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterEnumValuesByClass(target)
      .map(enumValueArg => ({
        target: enumValueArg.target,
        name: enumValueArg.name,
        value: enumValueArg.value,
        description: enumValueArg.description,
      }));
  }

}
