import { Option } from './option';

/**
 * [GraphQL Object Field's Argument]{@ http://graphql.org/learn/schema/#arguments} Decorator
 */
export interface OrderByOption extends Option {
  /**
   *
   */
  extraColumns: string[];

  /**
   *
   */
  shouldIgnoreSchemaFields?: boolean;
}
