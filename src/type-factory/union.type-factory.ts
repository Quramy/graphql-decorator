import * as graphql from 'graphql';
import { MetadataStorage } from '../metadata-storage';
import { UnionTypeMetadata } from '../metadata';
import { objectTypeFactory } from '../object_type_factory';

export function unionTypeFactory(name: string, isInput: boolean): graphql.GraphQLUnionType {
  return MetadataStorage.getUnionMetadata()
    .filter(union => union.name === name)
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
    .find((_, index) => index === 0) || null;
}
