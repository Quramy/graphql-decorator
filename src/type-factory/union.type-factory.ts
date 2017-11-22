import * as graphql from 'graphql';

import { getMetadataBuilder } from '../metadata-builder';
import { objectTypeFactory } from './object.type-factory';

export function unionTypeFactory(target: any, isInput: boolean): graphql.GraphQLUnionType | undefined {
  return getMetadataBuilder().buildUnionTypeMetadata(target)
    .map(metadata => {
      return new graphql.GraphQLUnionType({
        description: metadata.description,
        name: metadata.name,
        resolveType: metadata.resolver,
        types: metadata.types
          .map(type => objectTypeFactory(type, isInput) as graphql.GraphQLObjectType)
          .filter(_ => _), //filter null values
      });
    })
    .find((_, index) => index === 0);
}
