import { Option } from './option';

/**
 * Arguments for an {@link ObjectType} on graphql schema
 */
export interface ObjectOption extends Option {
  interfaces?: Function | Function[];
}
