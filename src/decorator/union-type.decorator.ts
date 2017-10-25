import { MetadataStorage } from '../metadata-storage';
import { UnionOption } from '../metadata';

/**
 * Union Type. ref: http://graphql.org/learn/schema/#union-types
 * @param option Options for a Union Type
 */
export function UnionType<T>(option: UnionOption<T>) {
  return function (target: any) {
      MetadataStorage.addUnionMetadata({
          name: target.name,
          types: option.types,
          resolver: option.resolver,
          description: option.description,
      });
  } as Function;
}
