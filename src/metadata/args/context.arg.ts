import { Argument } from './argument';

export interface ContextArg extends Argument {
  index: number;
  property: string;
}
