import { Argument } from './argument';

export interface OrderByArg extends Argument {
  index: number;
  property: string;
  extraColumns: string[];
  shouldIgnoreSchemaFields?: boolean;
}
