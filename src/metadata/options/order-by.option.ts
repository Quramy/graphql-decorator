import { DefaultOption } from './default.option';

/**
 * [GraphQL Object Field's Argument]{@ http://graphql.org/learn/schema/#arguments} Decorator
 */
export interface OrderByOption extends DefaultOption {
  /**
   *
   */
  extraColumns: string[];

  /**
   *
   */
  shouldIgnoreSchemaFields?: boolean;
}
