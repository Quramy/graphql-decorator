import { Argument } from './argument';

export interface ArgumentArg extends Argument {
  index: number;
  property: string;
  type?: any;
  nonNull?: boolean;
  isList?: boolean;
}
