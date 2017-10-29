import { DefaultArg } from './default.arg';

export interface ArgumentArg extends DefaultArg {
  index: number;
  property: string;
  type?: any;
  nonNull?: boolean;
  isList?: boolean;
}
