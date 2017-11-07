import {
  ArgumentArg,
  BeforeArg,
  ContextArg,
  EntryType,
  EntryTypeArg,
  EnumTypeArg,
  EnumValueArg,
  FieldArg,
  ObjectTypeArg,
  OrderByArg,
  RootArg,
  SchemaArg,
  UnionTypeArg,
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
  fields: FieldArg[] = [];
  arguments: ArgumentArg[] = [];
  contexts: ContextArg[] = [];
  roots: RootArg[] = [];
  orderBys: OrderByArg[] = [];
  befores: BeforeArg[] = [];

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

  filterFieldByClass(target: any): FieldArg[] {
    return this.fields.filter(item => item.target === target);
  }

  filterArgumentByClassAndProperty(target: any, property: string): ArgumentArg[] {
    return this.arguments.filter(item => item.target === target && item.property === property);
  }

  filterContextByClassAndProperty(target: any, property: string): ContextArg[] {
    return this.contexts.filter(item => item.target === target && item.property === property);
  }

  filterRootByClassAndProperty(target: any, property: string): RootArg[] {
    return this.roots.filter(item => item.target === target && item.property === property);
  }

  filterOrderByByClassAndProperty(target: any, property: string): OrderByArg[] {
    return this.orderBys.filter(item => item.target === target && item.property === property);
  }

  filterBeforeByByClassAndProperty(target: any, property: string): BeforeArg[] {
    return this.befores.filter(item => item.target === target && item.property === property);
  }
}

