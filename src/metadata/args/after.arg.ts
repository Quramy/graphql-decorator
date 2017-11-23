import { AfterMiddleware } from '../../middleware';
import { Argument } from './argument';

export interface AfterArg extends Argument {
  index: number;
  property: string;
  middleware: AfterMiddleware;
}
