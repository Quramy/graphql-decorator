import { EnumOption, EnumValueOption } from '../metadata';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * It can be used just like {@link ObjectType} in order to create {@link GraphQLEnumType} objects.
 * See [GraphQL Documentation - Enum Types]{@http://graphql.org/learn/schema/#enumeration-types}
 *
 * @param option Options for a Enum Type
 */
export function EnumType(option?: EnumOption) {
  return function (target: any) {
    getMetadataArgsStorage().enums.push({
      target: target,
      name: target.name,
      description: option ? option.description : null,
    });
  } as Function;
}

/**
 * Used to define a value for an {@link EnumType} definition.
 *
 * Example usage:
 *
 * ```typescript
 * @EnumType()
 * class MyEnum {
 *   @Value('1', {description: 'Value One'})
 *   VALUE_ONE: string;
 *
 *   @Value('2', {description: 'Value Two'})
 *   VALUE_TWO: string;
 * }
 *```
 *
 * @param value Value to be assigned to the property at schema level
 * @param option Options for a Enum Value
 */
export function Value(value: any, option?: EnumValueOption) {
  return function (target: any, propertyKey: any, methodDescriptor: any) {
    getMetadataArgsStorage().enumValues.push({
      target: target,
      name: propertyKey,
      value: value,
      description: option ? option.description : null,
    });
  } as Function;
}
