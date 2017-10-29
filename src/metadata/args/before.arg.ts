import { DefaultArg } from './default.arg';
import { Middleware } from '../../middleware';

export interface BeforeArg extends DefaultArg {
  index: number;
  property: string;
  middleware: Middleware;
}
