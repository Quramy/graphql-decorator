import { DefaultOption } from './default.option';
import { Middleware } from '../../middleware';

/**
 * [GraphQL Object Field's Argument]{@ http://graphql.org/learn/schema/#arguments} Decorator
 */
export interface BeforeOption extends DefaultOption {
  middleware: Middleware;
}
