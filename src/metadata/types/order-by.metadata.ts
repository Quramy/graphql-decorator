import { ArgumentMetadata } from './argument.metadata';

export interface OrderByMetadata extends ArgumentMetadata {
  extraColumns: string[];
  shouldIgnoreSchemaFields: boolean;
}
