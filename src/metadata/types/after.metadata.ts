import { AfterMiddleware } from '../../middleware';
import { FieldArgumentMetadata } from './field-argument.metadata';

export interface AfterMetadata extends FieldArgumentMetadata {
  middleware: AfterMiddleware;
}
