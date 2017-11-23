import { BeforeMiddleware } from '../../middleware';
import { Option } from './option';

/**
 * Before (aka Middleware) options
 */
export interface BeforeOption extends Option {
  /**
   * Middeware to change resolver behavior.
   * Check decorator docs for example usage.
   */
  middleware: BeforeMiddleware;
}
