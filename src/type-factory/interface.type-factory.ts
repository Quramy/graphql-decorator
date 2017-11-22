import * as graphql from 'graphql';

import { getMetadataBuilder } from '../metadata-builder';
import { objectTypeFactory } from './object.type-factory';
import { fieldTypeFactory } from './field.type-factory';

let interfaceTypeCache: { [key: string]: any } = {};

export function interfaceTypeFactory(target: any): graphql.GraphQLInterfaceType | undefined {
  return getMetadataBuilder().buildInterfaceTypeMetadata(target)
    .map(metadata => {
      if (!interfaceTypeCache[metadata.name]) {
        interfaceTypeCache[metadata.name] = new graphql.GraphQLInterfaceType({
          description: metadata.description,
          name: metadata.name,
          resolveType: metadata.resolver,
          fields: getMetadataBuilder()
            .buildFieldMetadata(target.prototype)
            .map(field => ({
              metadata: field,
              type: fieldTypeFactory(target, field),
            }))
            .reduce((fields, field) => {
              fields[field.metadata.name] = field.type;
              return fields;
            } , {} as { [key: string]: any}),
        });
      }
      return interfaceTypeCache[metadata.name];
    })
    .find((_, index) => index === 0);
}
