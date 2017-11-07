import * as graphql from 'graphql';

import { UnionTypeMetadata } from '../metadata';
import { getMetadataBuilder } from '../metadata-builder';
import { objectTypeFactory } from './object.type-factory';

export function unionTypeFactory(target: any, isInput: boolean): graphql.GraphQLUnionType | undefined {
  return getMetadataBuilder().buildUnionTypeMetadata(target)
    .map(union => {
      return new graphql.GraphQLUnionType({
        description: union.description,
        name: union.name,
        resolveType: union.resolver,
        types: union.types
          .map(type => objectTypeFactory(type, isInput) as graphql.GraphQLObjectType)
          .filter(_ => _), //filter null values
      });
    })
    .find((_, index) => index === 0);
}
