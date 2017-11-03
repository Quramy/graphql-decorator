import {
  ArgumentMetadata,
  BeforeMetadata,
  ContextMetadata,
  EntryTypeMetadata,
  EnumTypeMetadata,
  EnumValueMetadata,
  FieldMetadata,
  ObjectTypeMetadata,
  OrderByMetadata,
  RootMetadata,
  SchemaMetadata,
  UnionTypeMetadata,
} from '../metadata/types';

import { EntryType } from '../metadata/args';
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
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
        values: this.buildEnumValueMetadata(target),
      }));
  }

  buildUnionTypeMetadata(target: any): UnionTypeMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterUnionTypeByClass(target)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        resolver: arg.resolver,
        types: arg.types,
        description: arg.description,
      }));
  }

  buildObjectTypeMetadata(target: any): ObjectTypeMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterObjectTypeByClass(target)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
        isInput: arg.isInput,
      }));
  }

  buildEntryTypeMetadata(target: any, type: EntryType): EntryTypeMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterEntryTypesByClassAndType(target, type)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
        property: arg.property,
        isSubscription: type === EntryType.Subscription,
      }));
  }

  buildSchemaMetadata(target: any): SchemaMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterSchemaByClass(target)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
      }));
  }

  buildFieldMetadata(target: any): FieldMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterFieldByClass(target)
      .map((arg) => ({
        type: arg.type,
        target: arg.target,
        name: arg.name,
        description: arg.description,
        isNonNull: !!arg.nonNull,
        isList: !!arg.isList,
        isPagination: !!arg.pagination,
        property: arg.property,
        arguments: this.buildArgumentMetadata(target, arg.property),
        context: this.buildContextMetadata(target, arg.property),
        root: this.buildRootMetadata(target, arg.property),
        orderBy: this.buildOrderByMetadata(target, arg.property),
        before: this.buildBeforeMetadata(target, arg.property),
      }));
  }

  protected buildArgumentMetadata(target: any, property: string): ArgumentMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterArgumentByClassAndProperty(target, property)
      .map(arg => ({
        type: arg.type,
        target: arg.target,
        name: arg.name,
        description: arg.description,
        index: arg.index,
        property: arg.property,
        isNonNull: !!arg.nonNull,
        isList: !!arg.isList,
      }));
  }

  protected buildContextMetadata(target: any, property: string): ContextMetadata | undefined {
    return getMetadataArgsStorage()
      .filterContextByClassAndProperty(target, property)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
        index: arg.index,
        property: arg.property,
      }))
      .find((_, index) => index === 0);
  }

  protected buildRootMetadata(target: any, property: string): RootMetadata | undefined {
    return getMetadataArgsStorage()
      .filterRootByClassAndProperty(target, property)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
        index: arg.index,
        property: arg.property,
      }))
      .find((_, index) => index === 0);
  }

  protected buildOrderByMetadata(target: any, property: string): OrderByMetadata | undefined {
    return getMetadataArgsStorage()
      .filterOrderByByClassAndProperty(target, property)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
        index: arg.index,
        property: arg.property,
        extraColumns: arg.extraColumns,
        shouldIgnoreSchemaFields: arg.shouldIgnoreSchemaFields,
        isNonNull: false,
        isList: false,
      }))
      .find((_, index) => index === 0);
  }

  protected buildBeforeMetadata(target: any, property: string): BeforeMetadata | undefined {
    return getMetadataArgsStorage()
      .filterBeforeByByClassAndProperty(target, property)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        description: arg.description,
        index: arg.index,
        property: arg.property,
        middleware: arg.middleware,
      }))
      .find((_, index) => index === 0);
  }

  protected buildEnumValueMetadata(target: any): EnumValueMetadata[] | undefined {
    return getMetadataArgsStorage()
      .filterEnumValuesByClass(target)
      .map(arg => ({
        target: arg.target,
        name: arg.name,
        value: arg.value,
        description: arg.description,
      }));
  }

}
