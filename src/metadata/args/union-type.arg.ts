import { DefaultArg } from './default.arg';

export interface UnionTypeArg extends DefaultArg {
  types: any[];
  resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
