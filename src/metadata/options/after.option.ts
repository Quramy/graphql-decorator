import { AfterMiddleware } from '../../middleware';
import { Option } from './option';

/**
 * After (aka AfterMiddleware) options
 */
export interface AfterOption extends Option {
  /**
   * Middeware to change resolver behavior.
   * Check decorator docs for example usage.
   */
  middleware: AfterMiddleware;
}
