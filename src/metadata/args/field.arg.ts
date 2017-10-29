import { DefaultArg } from './default.arg';

export interface FieldArg extends DefaultArg {
  type?: any;
  nonNull?: boolean;
  isList?: boolean;
  pagination?: boolean;
}
