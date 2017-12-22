import { Option } from './option';

/**
 * Arguments for an {@link InterfaceType} on graphql schema
 */
export interface InterfaceOption<T> extends Option {
  /**
   * Resolver function to inform schema what type should be returned based on the value provided
   */
  resolver: (obj: T, context: any, info: any) => Promise<string> | string | null;
}
