import { BeforeMiddleware } from '../../middleware';
import { FieldArgumentMetadata } from './field-argument.metadata';

export interface BeforeMetadata extends FieldArgumentMetadata {
  middleware: BeforeMiddleware;
}
