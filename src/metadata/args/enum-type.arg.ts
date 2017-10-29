import { Argument } from './argument';

export interface EnumTypeArg extends Argument { }

export interface EnumValueArg extends Argument {
  value: any;
}

