import { Argument } from './argument';

export interface ObjectTypeArg extends Argument {
  isInput: boolean;
  interfaces: Function[];
}
