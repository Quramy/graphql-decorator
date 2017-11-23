import { AfterMetadata } from './after.metadata';
import { ArgumentMetadata } from './argument.metadata';
import { BeforeMetadata } from './before.metadata';
import { ContextMetadata } from './context.metadata';
import { Metadata } from './metadata';
import { OrderByMetadata } from './order-by.metadata';
import { RootMetadata } from './root.metadata';

export interface FieldMetadata extends Metadata {
  type?: any;
  isNonNull: boolean;
  isList: boolean;
  isPagination: boolean;
  property: string;
  arguments: ArgumentMetadata[];
  context?: ContextMetadata;
  root?: RootMetadata;
  orderBy?: OrderByMetadata;
  before?: BeforeMetadata;
  after?: AfterMetadata;
}
