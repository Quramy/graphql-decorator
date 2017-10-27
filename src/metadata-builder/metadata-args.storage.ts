import {
  EnumTypeArg,
  EnumValueArg,
  UnionTypeArg,
  ObjectTypeArg,
  EntryTypeArg,
  EntryType,
  SchemaArg,
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
  union: UnionTypeArg[] = [];
  objects: ObjectTypeArg[] = [];
  entries: EntryTypeArg[] = [];
  schemas: SchemaArg[] = [];

  filterEnumsByClass(target: any): EnumTypeArg[] {
    return this.enums.filter(item => item.target === target);
  }

  filterEnumValuesByClass(target: any): EnumValueArg[] {
    return this.enumValues.filter(item => item.target === target.prototype);
  }

  filterUnionTypeByClass(target: any): UnionTypeArg[] {
    return this.union.filter(item => item.target === target);
  }

  filterObjectTypeByClass(target: any): ObjectTypeArg[] {
    return this.objects.filter(item => item.target === target);
  }

  filterEntryTypesByClassAndType(target: any, type: EntryType): EntryTypeArg[] {
    return this.entries.filter(item => item.target === target.prototype && item.type === type);
  }

  filterSchemaByClass(target: any): SchemaArg[] {
    return this.schemas.filter(item => item.target === target);
  }
}

