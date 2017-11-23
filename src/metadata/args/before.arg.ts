import { Argument } from './argument';
import { BeforeMiddleware } from '../../middleware';

export interface BeforeArg extends Argument {
  index: number;
  property: string;
  middleware: BeforeMiddleware;
}
