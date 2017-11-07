import { Option } from './option';

/**
 * [GraphQL Object Field's Argument]{@ http://graphql.org/learn/schema/#arguments} Decorator
 */
export interface OrderByOption extends Option {
  /**
   * Extra columns to be added to order by schema enum should be added here
   */
  extraColumns: string[];

  /**
   * If true, it will ignore automatically infered columns from returning schema and will use only columns provided at `extraColumns` param
   */
  shouldIgnoreSchemaFields?: boolean;
}
