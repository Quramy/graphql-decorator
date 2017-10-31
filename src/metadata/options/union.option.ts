import { DefaultOption } from './default.option';

/**
 * Arguments for an {@link UnionType} on graphql schema
 */
export interface UnionOption<T> extends DefaultOption {
  /**
   * Concrete object types
   */
  types: any[];

  /**
   * Resolver function to inform schema what type should be returned based on the value provided
   */
  resolver: (obj: T, context: any, info: any) => Promise<string> | string | null;
}
