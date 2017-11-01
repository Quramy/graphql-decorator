import { Metadata } from './metadata';

export interface FieldArgumentMetadata extends Metadata {
  index: number;
  property: string;
}
