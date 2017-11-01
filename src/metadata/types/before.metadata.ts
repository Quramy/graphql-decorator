import { FieldArgumentMetadata } from './field-argument.metadata';
import { Middleware } from '../../middleware';

export interface BeforeMetadata extends FieldArgumentMetadata {
  middleware: Middleware;
}
