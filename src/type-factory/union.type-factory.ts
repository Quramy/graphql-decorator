import * as graphql from 'graphql';
import { getMetadataBuilder } from '../metadata-builder';
import { UnionTypeMetadata } from '../metadata';
import { objectTypeFactory } from '../object_type_factory';

export function unionTypeFactory(target: any, isInput: boolean): graphql.GraphQLUnionType | undefined {
  return getMetadataBuilder().buildUnionTypeMetadata(target)
    .map(union => {
      return new graphql.GraphQLUnionType({
        description: union.description,
        name: union.name,
        resolveType: union.resolver,
        types: union.types
          .map(type => objectTypeFactory(type, isInput))
          .filter(_ => _), //filter null values
      });
    })
    .find((_, index) => index === 0);
}
