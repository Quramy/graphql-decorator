import { Argument } from './argument';

export interface FieldArg extends Argument {
  type?: any;
  nonNull?: boolean;
  isList?: boolean;
  pagination?: boolean;
}
