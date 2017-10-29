import { DefaultArg } from './default.arg';

export interface ContextArg extends DefaultArg {
  index: number;
  property: string;
}
