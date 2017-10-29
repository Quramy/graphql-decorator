import { DefaultOption } from './default.option';

/**
 * [GraphQL Object's Field]{@ http://graphql.org/learn/queries/#fields} Decorator
 */
export interface FieldOption extends DefaultOption {
  /**
   * (Optional) Explicit field's type reference. If not provided, a type will be infered based on property's type.
   */
  type?: any;

  /**
   * (Optional) If field should be non nullable
   */
  nonNull?: boolean;

  /**
   * (Optional) If field is a list/array of some sort
   */
  isList?: boolean;

  /**
   * (Optional) If field's return is a pagination object
   */
  pagination?: boolean;
}
