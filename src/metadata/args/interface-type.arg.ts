import { Argument } from './argument';

export interface InterfaceTypeArg extends Argument {
  resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
