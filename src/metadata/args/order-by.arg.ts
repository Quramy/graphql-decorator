import { DefaultArg } from './default.arg';

export interface OrderByArg extends DefaultArg {
  index: number;
  property: string;
  extraColumns: string[];
  shouldIgnoreSchemaFields?: boolean;
}
