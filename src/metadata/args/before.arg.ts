import { Argument } from './argument';
import { Middleware } from '../../middleware';

export interface BeforeArg extends Argument {
  index: number;
  property: string;
  middleware: Middleware;
}
