import { Middleware } from '../../middleware';
import { Option } from './option';

/**
 * [GraphQL Object Field's Argument]{@ http://graphql.org/learn/schema/#arguments} Decorator
 */
export interface BeforeOption extends Option {
  middleware: Middleware;
}
