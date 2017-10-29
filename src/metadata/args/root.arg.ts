import { DefaultArg } from './default.arg';

export interface RootArg extends DefaultArg {
  index: number;
  property: string;
}
