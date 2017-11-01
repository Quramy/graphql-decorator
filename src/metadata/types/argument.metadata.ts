import { FieldArgumentMetadata } from './field-argument.metadata';

export interface ArgumentMetadata extends FieldArgumentMetadata {
  type?: any;
  isNonNull: boolean;
  isList: boolean;
}
