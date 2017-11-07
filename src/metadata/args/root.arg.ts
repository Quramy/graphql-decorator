import { Argument } from './argument';

export interface RootArg extends Argument {
  index: number;
  property: string;
}
