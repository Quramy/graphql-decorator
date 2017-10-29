import { DefaultArg } from './default.arg';

export interface EnumTypeArg extends DefaultArg { }

export interface EnumValueArg extends DefaultArg {
  value: any;
}

