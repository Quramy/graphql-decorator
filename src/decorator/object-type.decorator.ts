import { ObjectOption } from '../metadata/options';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * It is used to create {@link GraphQLObjectType} objects.
 * See [GraphQL Documentation - Object Types]{@http://graphql.org/learn/schema/#object-types-and-fields}
 *
 * @param option Options for an Object Type
 */
export function ObjectType(option?: ObjectOption) {
  return CreateObjectType(false, option);
}

/**
 * It is used to create {@link GraphQLInputObjectType} objects.
 * See [GraphQL Documentation - Input Types]{@http://graphql.org/learn/schema/#input-types}
 *
 * @param option Options for an Input Object Type
 */
export function InputObjectType(option?: ObjectOption) {
  return CreateObjectType(true, option);
}

function CreateObjectType(isInput: boolean, option?: ObjectOption) {
  return function (target: any) {
    getMetadataArgsStorage().objects.push({
      target: target,
      name: target.name,
      description: option ? option.description : null,
      isInput: isInput,
    });
  };
}

