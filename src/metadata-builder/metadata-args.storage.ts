import {
  EnumTypeArg,
  EnumValueArg,
  UnionTypeArgs,
  ObjectTypeArg,
} from '../metadata/args';

/**
 * Gets metadata args storage.
 * Metadata args storage follows the best practices and stores metadata in a global variable.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
  if (!(global as any).graphqlSchemaMetadataArgsStorage) {
      (global as any).graphqlSchemaMetadataArgsStorage = new MetadataArgsStorage();
  }

  return (global as any).graphqlSchemaMetadataArgsStorage;
}

export class MetadataArgsStorage {
  enums: EnumTypeArg[] = [];
  enumValues: EnumValueArg[] = [];
  union: UnionTypeArgs[] = [];
  objects: ObjectTypeArg[] = [];

  filterEnumsByClass(target: any): EnumTypeArg[] {
    return this.enums.filter(item => item.target === target);
  }

  filterEnumValuesByClass(target: any): EnumValueArg[] {
    return this.enumValues.filter(item => item.target === target.prototype);
  }

  filterUnionTypeByClass(target: any): UnionTypeArgs[] {
    return this.union.filter(item => item.target === target);
  }

  filterObjectTypeByClass(target: any): ObjectTypeArg[] {
    return this.objects.filter(item => item.target === target);
  }
}

