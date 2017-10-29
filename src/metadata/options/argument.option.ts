import { DefaultOption } from './default.option';

/**
 * [GraphQL Object Field's Argument]{@ http://graphql.org/learn/schema/#arguments} Decorator
 */
export interface ArgumentOption extends DefaultOption {
  /**
   * Argument's name
   */
  name: string;

  /**
   * (Optional) Explicit argument's type reference. If not provided, a type will be infered based on argument's declared type.
   */
  type?: any;

  /**
   * (Optional) If argument should be non nullable
   */
  nonNull?: boolean;

  /**
   * (Optional) If argument is a list/array of some sort
   */
  isList?: boolean;
}
