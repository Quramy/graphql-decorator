import { Argument } from './argument';

export interface UnionTypeArg extends Argument {
  types: any[];
  resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
